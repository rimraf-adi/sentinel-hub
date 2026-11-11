"""
Sentinel Telegram Notifier Integration Hook.

Supports:
1. Flexible Telegram Bot token & chat_id input (explicit config, env vars, .env,
   .sentinel/integrations/telegram-notifier/config.json, sentinel.protocol.yaml, or interactive CLI setup).
2. Custom messages via autonomous agents (Python API, sentinel.hooks dispatch, and CLI).
3. Hardcoded metric-based alert & lifecycle messages (NaN/Inf guard, loss spikes,
   gradient explosion/vanishing, new best checkpoints, target milestones, and latency/RTF).

Crash-immune by design: network or configuration errors are logged and never abort training.
Zero third-party Python dependencies required (stdlib only).
"""

from __future__ import annotations

import argparse
import getpass
import html
import json
import logging
import math
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

logger = logging.getLogger("sentinel.telegram_notifier")

TELEGRAM_API_BASE = "https://api.telegram.org"
MAX_TELEGRAM_MESSAGE_LEN = 4096
_PLACEHOLDER_RE = re.compile(r"^\$\{[A-Za-z0-9_]+\}$")

LEVEL_BADGES: Dict[str, str] = {
    "info": "ℹ️",
    "success": "✅",
    "warning": "⚠️",
    "error": "🚨",
    "agent": "🤖",
    "metric": "📊",
}

TEMPLATES: Dict[str, str] = {
    "train_begin": (
        "🚀 <b>Sentinel Training Started</b>\n"
        "{run_line}"
        "{model_line}"
        "{config_block}"
    ),
    "epoch_summary": (
        "📊 <b>Epoch {epoch} Summary</b>{run_suffix}\n"
        "{metrics_block}"
    ),
    "step_summary": (
        "📈 <b>Step {step} Heartbeat</b>{run_suffix}\n"
        "{metrics_block}"
    ),
    "train_end": (
        "🏁 <b>Sentinel Training Finished</b>\n"
        "{run_line}"
        "{best_block}"
    ),
    "nan_inf": (
        "🚨 <b>CRITICAL: Numerical Instability</b>{run_suffix}\n"
        "Metric <code>{metric}</code> became <code>{value}</code> at {location}.\n"
        "Check learning rate, AMP/bf16 scaling, or input batch."
    ),
    "loss_spike": (
        "⚠️ <b>Loss Spike Detected</b>{run_suffix}\n"
        "<code>{metric}</code> jumped to <code>{value:.4f}</code> "
        "(prev: <code>{prev:.4f}</code>, threshold: <code>{threshold}</code>) at {location}."
    ),
    "grad_explosion": (
        "💥 <b>Gradient Explosion Alert</b>{run_suffix}\n"
        "<code>{metric}</code> = <code>{value:.4f}</code> exceeds limit <code>{limit:.2f}</code> at {location}."
    ),
    "grad_vanishing": (
        "📉 <b>Vanishing Gradient Warning</b>{run_suffix}\n"
        "<code>{metric}</code> = <code>{value:.2e}</code> below limit <code>{limit:.2e}</code> at {location}."
    ),
    "new_best": (
        "🏆 <b>New Best {metric}</b>{run_suffix}\n"
        "Improved to <code>{value:.4f}</code> (prev best: <code>{prev_best}</code>) at {location}."
    ),
    "target_reached": (
        "🎯 <b>Target Reached: {metric}</b>{run_suffix}\n"
        "Reached <code>{value:.4f}</code> (target {op} <code>{target}</code>) at {location}."
    ),
    "latency_exceeded": (
        "⏱️ <b>Realtime Latency Budget Exceeded</b>{run_suffix}\n"
        "<code>{metric}</code> = <code>{value:.4f}</code> (budget: <code>{limit}</code>) at {location}."
    ),
}

DEFAULT_CONFIG: Dict[str, Any] = {
    "parse_mode": "HTML",
    "notify_on_train_begin": True,
    "notify_on_train_end": True,
    "epoch_summary_interval": 1,
    "step_summary_interval": 0,
    "cooldown_seconds": 30.0,
    "rules": {
        "nan_guard": True,
        "loss_spike_threshold": 10.0,
        "loss_spike_multiplier": 2.5,
        "max_grad_norm": 10.0,
        "min_grad_norm": 1e-6,
        "max_rtf": 1.0,
        "max_latency_ms": 500.0,
        "track_best_metrics": [
            {"name": "val_loss", "mode": "min"},
            {"name": "wer", "mode": "min"},
            {"name": "cer", "mode": "min"},
            {"name": "val_acc", "mode": "max"},
        ],
        "targets": {},
    },
}


class _NotifierState:
    """In-memory runtime state for credentials, best values, and alert cooldowns."""

    def __init__(self) -> None:
        self.reset()

    def reset(self, keep_config: bool = False) -> None:
        if not keep_config:
            self.config = {}
        self.run_id: Optional[str] = None
        self.best_metrics: Dict[str, float] = {}
        self.prev_metrics: Dict[str, float] = {}
        self.last_alert_ts: Dict[str, float] = {}
        self.fired_targets: set[str] = set()
        self.fired_nan_steps: set[str] = set()


_STATE = _NotifierState()


def _deep_merge(base: Dict[str, Any], override: Dict[str, Any]) -> Dict[str, Any]:
    merged: Dict[str, Any] = dict(base)
    for k, v in (override or {}).items():
        if isinstance(v, dict) and isinstance(merged.get(k), dict):
            merged[k] = _deep_merge(merged[k], v)
        else:
            merged[k] = v
    return merged


def _clean_secret(val: Any) -> Optional[str]:
    if val is None:
        return None
    s = str(val).strip()
    if not s or _PLACEHOLDER_RE.match(s):
        return None
    return s


def _read_dotenv(workspace_dir: Path) -> Dict[str, str]:
    env_map: Dict[str, str] = {}
    for candidate in (workspace_dir / ".env", workspace_dir.parent / ".env"):
        if not candidate.is_file():
            continue
        try:
            for raw_line in candidate.read_text(encoding="utf-8").splitlines():
                line = raw_line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                if line.startswith("export "):
                    line = line[len("export "):].strip()
                key, val = line.split("=", 1)
                key = key.strip()
                val = val.strip().strip('"').strip("'")
                if key and key not in env_map:
                    env_map[key] = val
            break
        except Exception:
            pass
    return env_map


def _config_file_candidates(workspace_dir: Path) -> List[Path]:
    return [
        workspace_dir / ".sentinel" / "integrations" / "telegram-notifier" / "config.json",
        workspace_dir / ".sentinel" / "integrations" / "telegram_notifier" / "config.json",
        workspace_dir / ".sentinel" / "telegram.json",
    ]


def _load_local_config(workspace_dir: Path) -> Dict[str, Any]:
    merged: Dict[str, Any] = {}

    # 1. Check sentinel.protocol.yaml if PyYAML is available
    for proto_path in (
        workspace_dir / "sentinel.protocol.yaml",
        workspace_dir / ".sentinel" / "sentinel.protocol.yaml",
    ):
        if proto_path.is_file():
            try:
                import yaml

                data = yaml.safe_load(proto_path.read_text(encoding="utf-8")) or {}
                for item in data.get("integrations", []) or []:
                    if isinstance(item, dict) and str(item.get("name", "")).lower() in (
                        "telegram-notifier",
                        "telegram_notifier",
                    ):
                        cfg = item.get("config") or {}
                        if isinstance(cfg, dict):
                            merged = _deep_merge(merged, cfg)
                        break
            except Exception:
                pass
            break

    # 2. Check local JSON config saved by setup/configure
    for cfg_path in _config_file_candidates(workspace_dir):
        if cfg_path.is_file():
            try:
                data = json.loads(cfg_path.read_text(encoding="utf-8"))
                if isinstance(data, dict):
                    merged = _deep_merge(merged, data)
                break
            except Exception:
                pass

    return merged


def _get_effective_config(
    config_override: Optional[Dict[str, Any]] = None,
    workspace_dir: str | Path = ".",
) -> Dict[str, Any]:
    ws = Path(workspace_dir)
    cfg = _deep_merge(DEFAULT_CONFIG, _load_local_config(ws))
    if _STATE.config:
        cfg = _deep_merge(cfg, _STATE.config)
    if config_override:
        cfg = _deep_merge(cfg, config_override)
    return cfg


def resolve_credentials(
    bot_token: Optional[str] = None,
    chat_id: Optional[str] = None,
    workspace_dir: str | Path = ".",
) -> Tuple[Optional[str], Optional[str]]:
    """Resolve Telegram bot token and chat ID across explicit args, runtime config, env, .env, and local files."""
    ws = Path(workspace_dir)
    cfg = _get_effective_config(workspace_dir=ws)
    dotenv = _read_dotenv(ws)

    token_candidates = [
        bot_token,
        cfg.get("bot_token"),
        cfg.get("token"),
        os.environ.get("TELEGRAM_BOT_TOKEN"),
        os.environ.get("TELEGRAM_TOKEN"),
        os.environ.get("SENTINEL_TELEGRAM_TOKEN"),
        dotenv.get("TELEGRAM_BOT_TOKEN"),
        dotenv.get("TELEGRAM_TOKEN"),
        dotenv.get("SENTINEL_TELEGRAM_TOKEN"),
    ]
    chat_candidates = [
        chat_id,
        cfg.get("chat_id"),
        os.environ.get("TELEGRAM_CHAT_ID"),
        os.environ.get("SENTINEL_TELEGRAM_CHAT_ID"),
        dotenv.get("TELEGRAM_CHAT_ID"),
        dotenv.get("SENTINEL_TELEGRAM_CHAT_ID"),
    ]

    resolved_token = next((c for c in (_clean_secret(x) for x in token_candidates) if c), None)
    resolved_chat = next((c for c in (_clean_secret(x) for x in chat_candidates) if c), None)
    return resolved_token, resolved_chat


def _ensure_sentinel_gitignore(workspace_dir: Path) -> None:
    sentinel_dir = workspace_dir / ".sentinel"
    sentinel_dir.mkdir(parents=True, exist_ok=True)
    gi_path = sentinel_dir / ".gitignore"
    entries = ["integrations/*/config.json", "telegram.json"]
    existing = gi_path.read_text(encoding="utf-8") if gi_path.is_file() else ""
    missing = [e for e in entries if e not in existing]
    if missing:
        prefix = "" if (not existing or existing.endswith("\n")) else "\n"
        gi_path.write_text(existing + prefix + "\n".join(missing) + "\n", encoding="utf-8")


def configure(
    bot_token: Optional[str] = None,
    chat_id: Optional[str] = None,
    workspace_dir: str | Path = ".",
    persist: bool = False,
    **overrides: Any,
) -> Dict[str, Any]:
    """Configure Telegram credentials and alert rules programmatically (and optionally persist locally)."""
    updates: Dict[str, Any] = dict(overrides)
    if bot_token is not None:
        updates["bot_token"] = bot_token
    if chat_id is not None:
        updates["chat_id"] = str(chat_id)

    _STATE.config = _deep_merge(_STATE.config, updates)

    if persist:
        ws = Path(workspace_dir)
        _ensure_sentinel_gitignore(ws)
        cfg_path = _config_file_candidates(ws)[0]
        cfg_path.parent.mkdir(parents=True, exist_ok=True)
        existing: Dict[str, Any] = {}
        if cfg_path.is_file():
            try:
                existing = json.loads(cfg_path.read_text(encoding="utf-8"))
            except Exception:
                existing = {}
        to_save = _deep_merge(existing, updates)
        cfg_path.write_text(json.dumps(to_save, indent=2) + "\n", encoding="utf-8")
        try:
            os.chmod(cfg_path, 0o600)
        except Exception:
            pass

    return _get_effective_config(workspace_dir=workspace_dir)


def _telegram_request(
    bot_token: str,
    method: str,
    payload: Optional[Dict[str, Any]] = None,
    timeout: float = 10.0,
) -> Optional[Dict[str, Any]]:
    url = f"{TELEGRAM_API_BASE}/bot{bot_token}/{method}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {"Content-Type": "application/json"} if data is not None else {}
    req = urllib.request.Request(url, data=data, headers=headers, method="POST" if data is not None else "GET")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            parsed = json.loads(body)
            if not parsed.get("ok"):
                logger.warning(f"Telegram API {method} returned ok=false: {parsed.get('description')}")
                return None
            return parsed
    except urllib.error.HTTPError as e:
        err_body = ""
        try:
            err_body = e.read().decode("utf-8", errors="replace")
        except Exception:
            pass
        logger.warning(f"Telegram API HTTP {e.code} on {method}: {err_body or e.reason}")
        return None
    except Exception as e:
        logger.warning(f"Telegram API request failed ({method}): {e}")
        return None


def _split_message(text: str, limit: int = MAX_TELEGRAM_MESSAGE_LEN) -> List[str]:
    if len(text) <= limit:
        return [text]
    chunks: List[str] = []
    remaining = text
    while remaining:
        if len(remaining) <= limit:
            chunks.append(remaining)
            break
        split_at = remaining.rfind("\n", 0, limit)
        if split_at <= 0:
            split_at = limit
        chunks.append(remaining[:split_at])
        remaining = remaining[split_at:].lstrip("\n")
    return chunks


def send_message(
    text: str,
    parse_mode: Optional[str] = None,
    disable_notification: bool = False,
    bot_token: Optional[str] = None,
    chat_id: Optional[str] = None,
    workspace_dir: str | Path = ".",
    timeout: float = 10.0,
) -> bool:
    """Send a Telegram message via Bot API. Crash-immune: returns False on failure."""
    token, target_chat = resolve_credentials(
        bot_token=bot_token,
        chat_id=chat_id,
        workspace_dir=workspace_dir,
    )
    if not token or not target_chat:
        logger.debug(
            "Telegram Notifier skipped send_message: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID. "
            "Run `uv run python .sentinel/integrations/telegram-notifier/hook.py setup` to configure."
        )
        return False

    cfg = _get_effective_config(workspace_dir=workspace_dir)
    mode = parse_mode if parse_mode is not None else cfg.get("parse_mode", "HTML")

    all_ok = True
    for chunk in _split_message(str(text)):
        payload: Dict[str, Any] = {
            "chat_id": target_chat,
            "text": chunk,
            "disable_notification": bool(disable_notification),
        }
        if mode:
            payload["parse_mode"] = mode
        res = _telegram_request(token, "sendMessage", payload=payload, timeout=timeout)
        if res is None:
            all_ok = False
    return all_ok


def send_agent_message(
    message: str,
    title: Optional[str] = None,
    level: str = "agent",
    run_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
    bot_token: Optional[str] = None,
    chat_id: Optional[str] = None,
    workspace_dir: str | Path = ".",
    silent: bool = False,
) -> bool:
    """Send a custom formatted message from an autonomous agent to Telegram."""
    badge = LEVEL_BADGES.get(str(level).lower(), "🤖")
    header = html.escape(title) if title else "Sentinel Agent Update"
    active_run = run_id or _STATE.run_id or os.environ.get("SENTINEL_RUN_ID")

    lines = [f"{badge} <b>{header}</b>"]
    if active_run:
        lines.append(f"<b>Run:</b> <code>{html.escape(str(active_run)[:12])}</code>")
    lines.append("")
    lines.append(html.escape(str(message)))

    if metadata:
        lines.append("")
        for k, v in metadata.items():
            lines.append(f"• <b>{html.escape(str(k))}:</b> <code>{html.escape(str(v))}</code>")

    return send_message(
        "\n".join(lines),
        parse_mode="HTML",
        disable_notification=silent,
        bot_token=bot_token,
        chat_id=chat_id,
        workspace_dir=workspace_dir,
    )


def on_agent_message(
    message: str,
    title: Optional[str] = None,
    level: str = "agent",
    run_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
    **kwargs: Any,
) -> bool:
    """Hook entrypoint for `sentinel.hooks.get_registry().dispatch('on_agent_message', ...)`."""
    return send_agent_message(
        message=message,
        title=title,
        level=level,
        run_id=run_id,
        metadata=metadata,
        bot_token=kwargs.get("bot_token"),
        chat_id=kwargs.get("chat_id"),
        workspace_dir=kwargs.get("workspace_dir", "."),
        silent=bool(kwargs.get("silent", False)),
    )


def _format_location(step: Optional[int], epoch: Optional[int]) -> str:
    parts = []
    if epoch is not None:
        parts.append(f"epoch <code>{epoch}</code>")
    if step is not None:
        parts.append(f"step <code>{step}</code>")
    return ", ".join(parts) if parts else "current step"


def _format_metrics_block(metrics: Dict[str, Any]) -> str:
    lines = []
    for k, v in metrics.items():
        if isinstance(v, (int, float)) and not isinstance(v, bool):
            val_str = f"{v:.4f}" if isinstance(v, float) and (abs(v) >= 1e-4 or v == 0.0) else f"{v:.2e}" if isinstance(v, float) else str(v)
        else:
            val_str = str(v)
        lines.append(f"• <b>{html.escape(str(k))}:</b> <code>{html.escape(val_str)}</code>")
    return "\n".join(lines) if lines else "• <i>no metrics</i>"


def _can_send_alert(alert_key: str, cooldown_seconds: float, now: Optional[float] = None) -> bool:
    ts = time.time() if now is None else now
    last = _STATE.last_alert_ts.get(alert_key)
    if last is not None and (ts - last) < cooldown_seconds:
        return False
    _STATE.last_alert_ts[alert_key] = ts
    return True


def _compare_target(value: float, op: str, target: float) -> bool:
    if op == "<=":
        return value <= target
    if op == "<":
        return value < target
    if op == ">=":
        return value >= target
    if op == ">":
        return value > target
    if op == "==":
        return value == target
    return False


def evaluate_metrics(
    metrics: Dict[str, Any],
    step: Optional[int] = None,
    epoch: Optional[int] = None,
    run_id: Optional[str] = None,
    config: Optional[Dict[str, Any]] = None,
    workspace_dir: str | Path = ".",
    dispatch: bool = True,
) -> List[str]:
    """
    Evaluate hardcoded metric rules against a metrics dict and dispatch Telegram alerts.

    Returns the list of formatted alert messages that triggered.
    """
    if not isinstance(metrics, dict) or not metrics:
        return []

    cfg = _get_effective_config(config_override=config, workspace_dir=workspace_dir)
    rules = cfg.get("rules") or {}
    cooldown = float(cfg.get("cooldown_seconds", 30.0))
    active_run = run_id or _STATE.run_id or os.environ.get("SENTINEL_RUN_ID")
    run_suffix = f" [<code>{html.escape(str(active_run)[:8])}</code>]" if active_run else ""
    location = _format_location(step, epoch)
    triggered: List[str] = []

    numeric_metrics: Dict[str, float] = {}
    for k, v in metrics.items():
        if isinstance(v, (int, float)) and not isinstance(v, bool):
            numeric_metrics[str(k)] = float(v)

    # 1. NaN / Inf guard
    if rules.get("nan_guard", True):
        for name, val in numeric_metrics.items():
            if math.isnan(val) or math.isinf(val):
                dedup_key = f"nan:{name}:{step}:{epoch}"
                if dedup_key not in _STATE.fired_nan_steps:
                    _STATE.fired_nan_steps.add(dedup_key)
                    msg = TEMPLATES["nan_inf"].format(
                        run_suffix=run_suffix,
                        metric=html.escape(name),
                        value="NaN" if math.isnan(val) else ("+Inf" if val > 0 else "-Inf"),
                        location=location,
                    )
                    triggered.append(msg)

    # Filter finite metrics for remaining rules
    finite = {k: v for k, v in numeric_metrics.items() if math.isfinite(v)}

    # 2. Loss spike guard
    spike_thresh = rules.get("loss_spike_threshold")
    spike_mult = rules.get("loss_spike_multiplier")
    for loss_key in ("loss", "train_loss", "train/loss", "val_loss", "val/loss", "ctc_loss"):
        if loss_key not in finite:
            continue
        val = finite[loss_key]
        prev = _STATE.prev_metrics.get(loss_key)
        abs_spike = spike_thresh is not None and val > float(spike_thresh)
        rel_spike = (
            spike_mult is not None
            and prev is not None
            and prev > 1e-8
            and val > prev * float(spike_mult)
        )
        if (abs_spike or rel_spike) and _can_send_alert(f"spike:{loss_key}", cooldown):
            msg = TEMPLATES["loss_spike"].format(
                run_suffix=run_suffix,
                metric=html.escape(loss_key),
                value=val,
                prev=prev if prev is not None else val,
                threshold=spike_thresh if abs_spike else f"{spike_mult}x prev",
                location=location,
            )
            triggered.append(msg)

    # 3. Gradient norm explosion / vanishing
    max_grad = rules.get("max_grad_norm")
    min_grad = rules.get("min_grad_norm")
    for grad_key in ("grad_norm", "total_grad_norm", "gradient_norm"):
        if grad_key not in finite:
            continue
        val = finite[grad_key]
        if max_grad is not None and val > float(max_grad) and _can_send_alert(f"grad_hi:{grad_key}", cooldown):
            triggered.append(
                TEMPLATES["grad_explosion"].format(
                    run_suffix=run_suffix,
                    metric=html.escape(grad_key),
                    value=val,
                    limit=float(max_grad),
                    location=location,
                )
            )
        elif min_grad is not None and val < float(min_grad) and _can_send_alert(f"grad_lo:{grad_key}", cooldown):
            triggered.append(
                TEMPLATES["grad_vanishing"].format(
                    run_suffix=run_suffix,
                    metric=html.escape(grad_key),
                    value=val,
                    limit=float(min_grad),
                    location=location,
                )
            )

    # 4. Realtime latency / RTF budget checks
    max_rtf = rules.get("max_rtf")
    max_lat = rules.get("max_latency_ms")
    if max_rtf is not None and "rtf" in finite and finite["rtf"] > float(max_rtf):
        if _can_send_alert("rtf_high", cooldown):
            triggered.append(
                TEMPLATES["latency_exceeded"].format(
                    run_suffix=run_suffix,
                    metric="rtf",
                    value=finite["rtf"],
                    limit=max_rtf,
                    location=location,
                )
            )
    if max_lat is not None:
        for lat_key in ("latency_ms", "chunk_latency_ms", "p95_latency_ms"):
            if lat_key in finite and finite[lat_key] > float(max_lat) and _can_send_alert(f"lat:{lat_key}", cooldown):
                triggered.append(
                    TEMPLATES["latency_exceeded"].format(
                        run_suffix=run_suffix,
                        metric=html.escape(lat_key),
                        value=finite[lat_key],
                        limit=f"{max_lat} ms",
                        location=location,
                    )
                )

    # 5. Track best metrics (notify on improvement after initial baseline)
    for spec in rules.get("track_best_metrics") or []:
        if isinstance(spec, str):
            m_name, mode = spec, "min"
        elif isinstance(spec, dict):
            m_name = spec.get("name", "")
            mode = str(spec.get("mode", "min")).lower()
        else:
            continue
        if m_name not in finite:
            continue
        val = finite[m_name]
        prev_best = _STATE.best_metrics.get(m_name)
        improved = prev_best is not None and ((val < prev_best) if mode == "min" else (val > prev_best))
        if prev_best is None:
            _STATE.best_metrics[m_name] = val
        elif improved:
            _STATE.best_metrics[m_name] = val
            if _can_send_alert(f"best:{m_name}", cooldown):
                triggered.append(
                    TEMPLATES["new_best"].format(
                        run_suffix=run_suffix,
                        metric=html.escape(m_name),
                        value=val,
                        prev_best=f"{prev_best:.4f}",
                        location=location,
                    )
                )

    # 6. Target milestones (fire once per metric target)
    targets = rules.get("targets") or {}
    if isinstance(targets, dict):
        for m_name, spec in targets.items():
            if m_name not in finite or m_name in _STATE.fired_targets:
                continue
            val = finite[m_name]
            if isinstance(spec, dict):
                op = str(spec.get("op", "<="))
                target_val = float(spec["value"])
            else:
                op = ">=" if any(tok in m_name.lower() for tok in ("acc", "f1", "auc", "bleu")) else "<="
                target_val = float(spec)
            if _compare_target(val, op, target_val):
                _STATE.fired_targets.add(m_name)
                triggered.append(
                    TEMPLATES["target_reached"].format(
                        run_suffix=run_suffix,
                        metric=html.escape(m_name),
                        value=val,
                        op=html.escape(op),
                        target=target_val,
                        location=location,
                    )
                )

    # Update previous metric values for next step delta checks
    _STATE.prev_metrics.update(finite)

    if dispatch:
        for msg in triggered:
            send_message(msg, workspace_dir=workspace_dir)

    return triggered


def on_train_begin(model=None, optimizer=None, config=None, **kwargs: Any) -> None:
    """Sentinel training hook: initializes state and sends start notification."""
    try:
        _STATE.reset(keep_config=True)
        if isinstance(config, dict):
            _STATE.config = _deep_merge(_STATE.config, config)
        _STATE.run_id = kwargs.get("run_id") or os.environ.get("SENTINEL_RUN_ID")
        cfg = _get_effective_config(config_override=config if isinstance(config, dict) else None)
        if not cfg.get("notify_on_train_begin", True):
            return

        run_line = f"<b>Run:</b> <code>{html.escape(str(_STATE.run_id)[:12])}</code>\n" if _STATE.run_id else ""
        model_name = model.__class__.__name__ if model is not None else None
        model_line = f"<b>Model:</b> <code>{html.escape(model_name)}</code>\n" if model_name else ""

        cfg_lines = []
        if isinstance(config, dict):
            for key in ("lr", "learning_rate", "batch_size", "epochs", "optimizer", "amp"):
                if key in config:
                    cfg_lines.append(f"• <b>{html.escape(key)}:</b> <code>{html.escape(str(config[key]))}</code>")
        config_block = ("\n" + "\n".join(cfg_lines)) if cfg_lines else ""

        send_message(
            TEMPLATES["train_begin"].format(
                run_line=run_line,
                model_line=model_line,
                config_block=config_block,
            )
        )
    except Exception as e:
        logger.debug(f"Telegram on_train_begin notice: {e}")


def on_step_end(step: int, loss: float, model=None, **kwargs: Any) -> None:
    """Sentinel training hook: checks step metrics against alert rules and optional heartbeat."""
    try:
        metrics: Dict[str, Any] = {"loss": loss}
        extra_metrics = kwargs.get("metrics")
        if isinstance(extra_metrics, dict):
            metrics.update(extra_metrics)
        for k, v in kwargs.items():
            if k not in ("metrics", "workspace_dir", "config") and isinstance(v, (int, float)) and not isinstance(v, bool):
                metrics[k] = v

        ws = kwargs.get("workspace_dir", ".")
        evaluate_metrics(metrics, step=step, workspace_dir=ws)

        cfg = _get_effective_config(workspace_dir=ws)
        interval = int(cfg.get("step_summary_interval", 0) or 0)
        if interval > 0 and step > 0 and step % interval == 0:
            run_suffix = f" [<code>{html.escape(str(_STATE.run_id)[:8])}</code>]" if _STATE.run_id else ""
            send_message(
                TEMPLATES["step_summary"].format(
                    step=step,
                    run_suffix=run_suffix,
                    metrics_block=_format_metrics_block(metrics),
                ),
                workspace_dir=ws,
            )
    except Exception as e:
        logger.debug(f"Telegram on_step_end notice: {e}")


def on_epoch_end(epoch: int, val_loss: float, model=None, **kwargs: Any) -> None:
    """Sentinel training hook: checks epoch metrics and sends periodic epoch summary."""
    try:
        metrics: Dict[str, Any] = {"val_loss": val_loss}
        extra_metrics = kwargs.get("metrics")
        if isinstance(extra_metrics, dict):
            metrics.update(extra_metrics)
        for k, v in kwargs.items():
            if k not in ("metrics", "workspace_dir", "config", "trial") and isinstance(v, (int, float)) and not isinstance(v, bool):
                metrics[k] = v

        ws = kwargs.get("workspace_dir", ".")
        evaluate_metrics(metrics, epoch=epoch, workspace_dir=ws)

        cfg = _get_effective_config(workspace_dir=ws)
        interval = int(cfg.get("epoch_summary_interval", 1) or 0)
        if interval > 0 and epoch % interval == 0:
            run_suffix = f" [<code>{html.escape(str(_STATE.run_id)[:8])}</code>]" if _STATE.run_id else ""
            send_message(
                TEMPLATES["epoch_summary"].format(
                    epoch=epoch,
                    run_suffix=run_suffix,
                    metrics_block=_format_metrics_block(metrics),
                ),
                workspace_dir=ws,
            )
    except Exception as e:
        logger.debug(f"Telegram on_epoch_end notice: {e}")


def on_train_end(model=None, run_id: Optional[str] = None, **kwargs: Any) -> None:
    """Sentinel training hook: sends completion message with best tracked metrics."""
    try:
        ws = kwargs.get("workspace_dir", ".")
        cfg = _get_effective_config(workspace_dir=ws)
        if not cfg.get("notify_on_train_end", True):
            return

        final_run_id = run_id or _STATE.run_id or os.environ.get("SENTINEL_RUN_ID")
        run_line = f"<b>Run:</b> <code>{html.escape(str(final_run_id)[:12])}</code>\n" if final_run_id else ""
        summary_metrics = dict(_STATE.best_metrics)
        if isinstance(kwargs.get("metrics"), dict):
            summary_metrics.update(kwargs["metrics"])
        best_block = ("\n<b>Best Metrics:</b>\n" + _format_metrics_block(summary_metrics)) if summary_metrics else ""

        send_message(
            TEMPLATES["train_end"].format(run_line=run_line, best_block=best_block),
            workspace_dir=ws,
        )
    except Exception as e:
        logger.debug(f"Telegram on_train_end notice: {e}")


def _detect_chat_id(bot_token: str) -> Optional[str]:
    res = _telegram_request(bot_token, "getUpdates", payload=None, timeout=10.0)
    if not res:
        return None
    for item in reversed(res.get("result") or []):
        msg = item.get("message") or item.get("channel_post") or {}
        chat = msg.get("chat") or {}
        if "id" in chat:
            return str(chat["id"])
    return None


def _cli_setup(args: argparse.Namespace) -> int:
    ws = Path(args.workspace)
    token = _clean_secret(args.token)
    chat_id = _clean_secret(args.chat_id)

    if not token:
        if args.non_interactive:
            print("Error: --token is required in --non-interactive mode.", file=sys.stderr)
            return 1
        token = _clean_secret(getpass.getpass("Enter Telegram Bot Token (from @BotFather): "))
        if not token:
            print("Error: Telegram Bot Token cannot be empty.", file=sys.stderr)
            return 1

    if not chat_id:
        if args.non_interactive:
            chat_id = _detect_chat_id(token)
        else:
            raw_chat = input("Enter Telegram Chat ID (leave blank to auto-detect from recent bot message): ").strip()
            chat_id = _clean_secret(raw_chat) or _detect_chat_id(token)

    if not chat_id:
        print(
            "Error: Could not determine Chat ID. Send any message to your bot first or pass --chat-id.",
            file=sys.stderr,
        )
        return 1

    configure(bot_token=token, chat_id=chat_id, workspace_dir=ws, persist=True)
    cfg_path = _config_file_candidates(ws)[0]
    print(f"Saved Telegram Notifier credentials to {cfg_path}")

    if not args.no_test:
        ok = send_agent_message(
            "Telegram Notifier integration configured and verified.",
            title="Sentinel Connected",
            level="success",
            workspace_dir=ws,
        )
        print("Test message sent." if ok else "Warning: credentials saved, but test message failed.")
        return 0 if ok else 2
    return 0


def _cli_send(args: argparse.Namespace) -> int:
    metadata: Dict[str, Any] = {}
    for item in args.meta or []:
        if "=" in item:
            k, v = item.split("=", 1)
            metadata[k.strip()] = v.strip()

    ok = send_agent_message(
        message=args.message,
        title=args.title,
        level=args.level,
        run_id=args.run_id,
        metadata=metadata or None,
        bot_token=args.token,
        chat_id=args.chat_id,
        workspace_dir=args.workspace,
        silent=args.silent,
    )
    if not ok:
        print("Failed to send Telegram message (check token/chat_id).", file=sys.stderr)
        return 1
    print("Telegram message sent.")
    return 0


def _cli_notify_metrics(args: argparse.Namespace) -> int:
    try:
        metrics = json.loads(args.metrics)
    except Exception as e:
        print(f"Invalid --metrics JSON: {e}", file=sys.stderr)
        return 1
    if not isinstance(metrics, dict):
        print("--metrics must be a JSON object.", file=sys.stderr)
        return 1

    if args.token or args.chat_id:
        configure(bot_token=args.token, chat_id=args.chat_id, workspace_dir=args.workspace)

    alerts = evaluate_metrics(
        metrics=metrics,
        step=args.step,
        epoch=args.epoch,
        run_id=args.run_id,
        workspace_dir=args.workspace,
        dispatch=True,
    )
    print(f"Evaluated {len(metrics)} metric(s); triggered {len(alerts)} alert(s).")
    return 0


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="telegram-notifier",
        description="Sentinel Telegram Notifier integration CLI",
    )
    parser.add_argument("--workspace", default=".", help="Sentinel workspace root (default: .)")
    sub = parser.add_subparsers(dest="command", required=True)

    p_setup = sub.add_parser("setup", help="Configure Telegram Bot Token and Chat ID")
    p_setup.add_argument("--token", help="Telegram Bot Token")
    p_setup.add_argument("--chat-id", help="Telegram Chat ID")
    p_setup.add_argument("--non-interactive", action="store_true", help="Fail instead of prompting")
    p_setup.add_argument("--no-test", action="store_true", help="Skip sending test message")

    p_send = sub.add_parser("send", help="Send a custom agent message to Telegram")
    p_send.add_argument("message", help="Message body")
    p_send.add_argument("--title", default=None, help="Optional header title")
    p_send.add_argument(
        "--level",
        default="agent",
        choices=sorted(LEVEL_BADGES.keys()),
        help="Message badge level",
    )
    p_send.add_argument("--run-id", default=None, help="Optional Sentinel run ID")
    p_send.add_argument("--meta", action="append", help="Key=Value metadata (repeatable)")
    p_send.add_argument("--silent", action="store_true", help="Send without notification sound")
    p_send.add_argument("--token", default=None, help="Override Telegram Bot Token")
    p_send.add_argument("--chat-id", default=None, help="Override Telegram Chat ID")

    p_metrics = sub.add_parser("notify-metrics", help="Evaluate hardcoded metric alert rules")
    p_metrics.add_argument("--metrics", required=True, help="JSON object of metric name -> value")
    p_metrics.add_argument("--step", type=int, default=None, help="Training step")
    p_metrics.add_argument("--epoch", type=int, default=None, help="Training epoch")
    p_metrics.add_argument("--run-id", default=None, help="Optional Sentinel run ID")
    p_metrics.add_argument("--token", default=None, help="Override Telegram Bot Token")
    p_metrics.add_argument("--chat-id", default=None, help="Override Telegram Chat ID")

    p_test = sub.add_parser("test", help="Send a test ping using configured credentials")
    p_test.add_argument("--token", default=None, help="Override Telegram Bot Token")
    p_test.add_argument("--chat-id", default=None, help="Override Telegram Chat ID")

    return parser


def main(argv: Optional[Iterable[str]] = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(list(argv) if argv is not None else None)
    if args.command == "setup":
        return _cli_setup(args)
    if args.command == "send":
        return _cli_send(args)
    if args.command == "notify-metrics":
        return _cli_notify_metrics(args)
    if args.command == "test":
        ok = send_agent_message(
            "Test ping from Sentinel Telegram Notifier.",
            title="Sentinel Test Ping",
            level="info",
            bot_token=args.token,
            chat_id=args.chat_id,
            workspace_dir=args.workspace,
        )
        print("Test message sent." if ok else "Failed to send test message.")
        return 0 if ok else 1
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
