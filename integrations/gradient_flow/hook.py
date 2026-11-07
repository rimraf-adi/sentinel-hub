"""
Sentinel Gradient Flow Runtime Hook
Attaches live tensor gradient and activation flow watchers to visualize in the Sentinel UI.
"""
import logging

logger = logging.getLogger("sentinel.gradient_flow")
_watcher = None

def on_train_begin(model, optimizer=None, config=None):
    global _watcher
    try:
        import sentinel
        _watcher = sentinel.watch_model(model, log_freq=10)
        logger.info("Gradient Flow Hook Active: live tensor flow telemetry streaming.")
    except Exception as e:
        logger.debug(f"Gradient flow watch notice: {e}")

def on_train_end(model=None, run_id=None):
    global _watcher
    if _watcher is not None:
        try:
            _watcher.remove()
        except Exception:
            pass
        _watcher = None
