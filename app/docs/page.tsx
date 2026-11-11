"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "../components/Footer";
import { 
  Terminal, 
  Copy, 
  Check, 
  Layers, 
  Cpu, 
  Share2, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Boxes,
  FileCode,
  Network,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Sliders,
} from "lucide-react";

function SentinelLogo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Sentinel"
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id="sentinel-docs-grad" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="33" height="33" rx="8.5" fill="#090a0f" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
      <g>
        <path d="M 23.5 11.5 H 15.5 L 10.5 16.5" stroke="url(#sentinel-docs-grad)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 12 15.5 L 24 20.5" stroke="url(#sentinel-docs-grad)" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 25.5 19.5 L 20.5 24.5 H 12.5" stroke="url(#sentinel-docs-grad)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="23.5" cy="11.5" r="2.2" fill="#090a0f" stroke="url(#sentinel-docs-grad)" strokeWidth="1.8" />
        <circle cx="12.5" cy="24.5" r="2.2" fill="#090a0f" stroke="url(#sentinel-docs-grad)" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function DocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070709] text-zinc-100 font-sans">
      {/* Minimal Top Bar (No Nav Links row) */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#070709]/90 backdrop-blur-md px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <SentinelLogo size={20} />
            <span className="font-semibold text-sm text-white tracking-tight">sentinel</span>
          </Link>
          <span className="text-zinc-600 font-mono text-xs">/</span>
          <span className="text-zinc-400 font-mono text-xs font-medium">docs</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/catalog"
            className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 font-mono"
          >
            <span>Catalog</span>
            <ArrowRight className="w-3 h-3 text-zinc-500" />
          </Link>

          <a
            href="https://github.com/rimraf-adi/sentinel"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Complete Left Side Navigation Index */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-7 pr-2">
              <div>
                <h3 className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold mb-2.5">
                  Getting Started
                </h3>
                <ul className="space-y-1 text-[13px]">
                  <li>
                    <a href="#overview" className="block py-1 text-zinc-300 hover:text-white transition-colors">
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="#quickstart" className="block py-1 text-zinc-400 hover:text-white transition-colors">
                      Installation &amp; Setup
                    </a>
                  </li>
                  <li>
                    <a href="#windows-gpu" className="block py-1 text-zinc-400 hover:text-white transition-colors">
                      Windows GPU &amp; Tailscale
                    </a>
                  </li>
                  <li>
                    <a href="#architecture" className="block py-1 text-zinc-400 hover:text-white transition-colors">
                      Core Architecture
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold mb-2.5">
                  Hub Registry &amp; Blueprints
                </h3>
                <ul className="space-y-1 text-[13px]">
                  <li>
                    <Link href="/catalog" className="py-1 text-zinc-300 hover:text-white flex items-center justify-between group transition-colors">
                      <span>Browse Catalog</span>
                      <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/templates" className="py-1 text-zinc-400 hover:text-white flex items-center justify-between group transition-colors">
                      <span>Templates Guide</span>
                      <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/integrations" className="py-1 text-zinc-400 hover:text-white flex items-center justify-between group transition-colors">
                      <span>Companion Hooks &amp; Packs</span>
                      <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
                    </Link>
                  </li>
                  <li>
                    <a href="#modular-blocks" className="block py-1 text-zinc-400 hover:text-white transition-colors">
                      Modular Blocks YAML
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2.5">
                  CLI &amp; Core Engine
                </h3>
                <ul className="space-y-1 text-[13px]">
                  <li>
                    <a href="#cli-reference" className="block py-1 text-zinc-400 hover:text-white transition-colors">
                      CLI Command Reference
                    </a>
                  </li>
                  <li>
                    <a href="#http-api" className="block py-1 text-zinc-400 hover:text-white transition-colors">
                      REST &amp; WebSocket API
                    </a>
                  </li>
                  <li>
                    <a href="#publishing" className="block py-1 text-zinc-400 hover:text-white transition-colors">
                      Publishing Modules
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-2.5">
                  Fault Tolerance
                </h3>
                <ul className="space-y-1 text-[13px]">
                  <li>
                    <a href="#checkpoints" className="block py-1 text-zinc-400 hover:text-white transition-colors">
                      Atomic Checkpoint &amp; Resume
                    </a>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Zero Lock-In Guarantee</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Export any component to a plain PyTorch script with no runtime dependency on Sentinel.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Docs Content */}
          <div className="lg:col-span-3 space-y-16">
            {/* Overview */}
            <section id="overview" className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                DOCUMENTATION · CORE ARCHITECTURE
              </div>
              <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-white">
                Sentinel Hub Documentation
              </h1>
              <p className="text-base text-zinc-300 leading-relaxed max-w-3xl">
                Sentinel is a lightweight training supervisor and ML operations plane designed for coding agents and ML teams. Models are defined as declarative YAML graphs that compile to clean PyTorch modules, while an asynchronous Rust microkernel supervises execution, allocates GPUs, and streams telemetry without overhead.
              </p>
            </section>

            {/* Quickstart / Installation */}
            <section id="quickstart" className="space-y-4 pt-6 border-t border-white/[0.08]">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-sky-400" />
                <span>Installation &amp; Quick Start</span>
              </h2>
              <p className="text-sm text-zinc-400">
                Requires Rust 1.75+, Python 3.10+, and optionally <a href="https://github.com/astral-sh/uv" target="_blank" rel="noreferrer" className="text-sky-400 underline">uv</a>.
              </p>

              <div className="relative rounded-xl bg-[#0b0c10] border border-white/[0.1] p-4 font-mono text-xs text-zinc-200">
                <button
                  onClick={() => copy("curl -fsSL https://raw.githubusercontent.com/rimraf-adi/sentinel/main/install.sh | bash", "install-docs")}
                  className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                  title="Copy macOS/Linux command"
                >
                  {copiedId === "install-docs" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre className="overflow-x-auto text-zinc-300">
{`# macOS & Linux (Bash)
curl -fsSL https://raw.githubusercontent.com/rimraf-adi/sentinel/main/install.sh | bash

# Or via Cargo directly (any OS):
cargo install --git https://github.com/rimraf-adi/sentinel.git sentinel-cli

# Launch the supervisor dashboard
sentinel dev  # active at http://localhost:2512`}
                </pre>
              </div>

              <div className="relative rounded-xl bg-[#0b0c10] border border-white/[0.1] p-4 font-mono text-xs text-zinc-200">
                <button
                  onClick={() => copy("irm https://raw.githubusercontent.com/rimraf-adi/sentinel/main/install.ps1 | iex", "install-docs-win")}
                  className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                  title="Copy Windows PowerShell command"
                >
                  {copiedId === "install-docs-win" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre className="overflow-x-auto text-zinc-300">
{`# Windows (PowerShell)
irm https://raw.githubusercontent.com/rimraf-adi/sentinel/main/install.ps1 | iex

# Or cross-compile sentinel.exe from macOS/Linux (requires mingw-w64):
./scripts/build-windows.sh`}
                </pre>
              </div>

              <p className="text-xs text-zinc-400">
                Run <code className="text-sky-300 bg-white/[0.05] px-1.5 py-0.5 rounded font-mono">sentinel doctor</code> to verify your Python, PyTorch, and GPU runtime environment.
              </p>
            </section>

            {/* Windows GPU & Remote Access */}
            <section id="windows-gpu" className="space-y-4 pt-6 border-t border-white/[0.08]">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <span>Windows GPU &amp; Remote VPS (Tailscale)</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                On Windows GPU machines, verify your NVIDIA driver (<code className="text-zinc-200">nvidia-smi</code>) and install a CUDA-enabled PyTorch build inside a virtual environment before starting training jobs.
              </p>

              <div className="relative rounded-xl bg-[#0b0c10] border border-white/[0.1] p-4 font-mono text-xs text-zinc-200">
                <button
                  onClick={() =>
                    copy(
                      "python -m venv .venv\n.\\.venv\\Scripts\\Activate.ps1\npip install torch torchvision --index-url https://download.pytorch.org/whl/cu124\nsentinel init && sentinel doctor && sentinel gpus",
                      "win-cuda-docs"
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                  title="Copy Windows CUDA setup"
                >
                  {copiedId === "win-cuda-docs" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre className="overflow-x-auto text-zinc-300">
{`# 1. Create a venv with CUDA PyTorch on Windows PowerShell
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu124

# (Optional if running outside the activated shell)
$env:SENTINEL_PYTHON = "$PWD\\.venv\\Scripts\\python.exe"

# 2. Initialize project and confirm CUDA + nvidia-smi
sentinel init
sentinel doctor
sentinel gpus`}
                </pre>
              </div>

              <div className="relative rounded-xl bg-[#0b0c10] border border-white/[0.1] p-4 font-mono text-xs text-zinc-200">
                <button
                  onClick={() => copy("sentinel dev\ntailscale serve --bg http://127.0.0.1:2512", "win-tailscale-docs")}
                  className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                  title="Copy Tailscale command"
                >
                  {copiedId === "win-tailscale-docs" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre className="overflow-x-auto text-zinc-300">
{`# Keep Sentinel bound to 127.0.0.1 and expose privately over Tailscale HTTPS:
sentinel dev
tailscale serve --bg http://127.0.0.1:2512
tailscale serve status`}
                </pre>
              </div>

              <p className="text-xs text-zinc-500">
                Sentinel&apos;s daemon API has no built-in authentication. Use <code className="text-zinc-300">tailscale serve</code> (private tailnet only) or an SSH tunnel (<code className="text-zinc-300">ssh -L 2512:127.0.0.1:2512 user@host</code>) rather than public <code className="text-zinc-300">tailscale funnel</code> or <code className="text-zinc-300">0.0.0.0</code>.
              </p>
            </section>

            {/* Architecture Plane */}
            <section id="architecture" className="space-y-4 pt-6 border-t border-white/[0.08]">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-sky-400" />
                <span>Architecture</span>
              </h2>
              <p className="text-sm text-zinc-400">
                Sentinel separates the control plane from the execution environment to eliminate framework wrappers, process leaks, and training pauses:
              </p>

              <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.04] text-zinc-300 font-semibold border-b border-white/[0.08]">
                    <tr>
                      <th className="py-3 px-4">Plane</th>
                      <th className="py-3 px-4">Language</th>
                      <th className="py-3 px-4">Responsibilities</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-zinc-400">
                    <tr>
                      <td className="py-3 px-4 font-semibold text-white">Control Plane</td>
                      <td className="py-3 px-4 font-mono text-amber-400">Rust</td>
                      <td className="py-3 px-4">Process supervision, GPU allocation (NVML), telemetry streaming, component resolution, embedded dashboard, REST/WebSocket API</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-white">Execution Plane</td>
                      <td className="py-3 px-4 font-mono text-sky-400">Python</td>
                      <td className="py-3 px-4">Training loops and sweeps (PyTorch, Hugging Face, Optuna), launched with uv run, logging through sentinel-sdk</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Modular Blocks Specification */}
            <section id="modular-blocks" className="space-y-4 pt-6 border-t border-white/[0.08]">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-sky-400" />
                <span>Modular Blocks Specification</span>
              </h2>
              <p className="text-sm text-zinc-400">
                Models in Sentinel are composed of compound and fundamental blocks. Input shapes are inferred from wiring, and compounds compile into nested PyTorch classes:
              </p>

              <div className="relative rounded-xl bg-[#0b0c10] border border-white/[0.1] p-4 font-mono text-xs">
                <div className="text-zinc-500 mb-2 font-mono"># crates/sentinel-core/builtin/blocks/core/residual_mlp_block.yaml</div>
                <pre className="overflow-x-auto text-zinc-300">
{`compound: residual_mlp_block
params:
  hidden: {default: 64}
  width: {} # required
graph:
  inputs: {in: [B, "\${width}"]}
  nodes:
    mlp: {block: mlp_block, params: {width: "\${hidden}"}}
    proj: {block: linear, params: {out: "\${width}"}}
    skip: {block: add}
  edges: ["in -> mlp", "mlp -> proj", "proj -> skip.a", "in -> skip.b"]
  outputs: {out: skip}`}
                </pre>
              </div>
            </section>

            {/* CLI Reference */}
            <section id="cli-reference" className="space-y-4 pt-6 border-t border-white/[0.08]">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-sky-400" />
                <span>CLI Command Reference</span>
              </h2>

              <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.04] text-zinc-300 font-semibold border-b border-white/[0.08]">
                    <tr>
                      <th className="py-3 px-4">Command</th>
                      <th className="py-3 px-4">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-zinc-400 font-mono">
                    <tr>
                      <td className="py-3 px-4 text-sky-400">sentinel dev [--port N]</td>
                      <td className="py-3 px-4 font-sans text-zinc-300">Start the daemon and embedded dashboard</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sky-400">sentinel new &lt;NAME&gt; / init</td>
                      <td className="py-3 px-4 font-sans text-zinc-300">Scaffold a new project or adopt an existing directory</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sky-400">sentinel run / sweep &lt;CONFIG&gt;</td>
                      <td className="py-3 px-4 font-sans text-zinc-300">Run a training job or parallel hyperparameter sweep</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sky-400">sentinel component …</td>
                      <td className="py-3 px-4 font-sans text-zinc-300">list, show, blocks, training, new, check, save-run</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sky-400">sentinel add &lt;ID&gt;</td>
                      <td className="py-3 px-4 font-sans text-zinc-300">Scaffold a remote template directly from Sentinel Hub</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sky-400">sentinel model …</td>
                      <td className="py-3 px-4 font-sans text-zinc-300">list, predict, export, generate</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sky-400">sentinel export script</td>
                      <td className="py-3 px-4 font-sans text-zinc-300">Export a standalone PyTorch script without dependencies</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sky-400">sentinel doctor</td>
                      <td className="py-3 px-4 font-sans text-zinc-300">Check the Python/PyTorch environment and NVML drivers</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Atomic Checkpointing & Resume */}
            <section id="checkpoints" className="space-y-4 pt-6 border-t border-white/[0.08]">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Atomic Checkpointing &amp; Seamless Resume</span>
              </h2>
              <p className="text-sm text-zinc-400">
                Sentinel automatically integrates crash-safe atomic checkpointing by default into all training scripts. State is written to a temporary file before being atomically replaced via filesystem operations:
              </p>

              <div className="rounded-xl bg-[#0b0c10] border border-white/[0.1] p-4 font-mono text-xs">
                <div className="text-zinc-500 mb-2 font-mono"># sentinel.yaml / component training configuration</div>
                <pre className="text-sky-300">
{`training:
  checkpoint: latest   # Options: "latest" (default), "all", or "off"
  resume: true         # Automatically restore state on restart
  epochs: 100
  loss: { name: "cross_entropy" }
  optimizer: { name: "adamw", lr: 0.0003 }`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="text-sky-400 font-semibold mb-1">checkpoint: latest</div>
                  <p className="font-sans text-zinc-400 leading-relaxed">
                    Overwrites <code className="text-white font-mono">checkpoint_latest.pt</code> atomically at each epoch end. Preserves disk space while ensuring crash-immunity.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="text-purple-400 font-semibold mb-1">checkpoint: all</div>
                  <p className="font-sans text-zinc-400 leading-relaxed">
                    Saves permanent checkpoints <code className="text-white font-mono">checkpoint_epoch_&#123;N&#125;.pt</code> for all epochs while continuously updating <code className="text-white font-mono">checkpoint_latest.pt</code>.
                  </p>
                </div>
              </div>
            </section>

            {/* HTTP API */}
            <section id="http-api" className="space-y-4 pt-6 border-t border-white/[0.08]">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-sky-400" />
                <span>HTTP &amp; WebSocket API</span>
              </h2>

              <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.04] text-zinc-300 font-semibold border-b border-white/[0.08]">
                    <tr>
                      <th className="py-3 px-4">Endpoint</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-zinc-400">
                    <tr>
                      <td className="py-3 px-4 font-mono text-zinc-200">/api/health</td>
                      <td className="py-3 px-4 font-mono text-emerald-400">GET</td>
                      <td className="py-3 px-4">Health check and daemon status</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-zinc-200">/api/jobs</td>
                      <td className="py-3 px-4 font-mono text-sky-400">GET, POST</td>
                      <td className="py-3 px-4">List running and completed jobs, or submit a command</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-zinc-200">/api/jobs/run-component</td>
                      <td className="py-3 px-4 font-mono text-amber-400">POST</td>
                      <td className="py-3 px-4">Launch training from &#123;component_id, overrides&#125;</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-zinc-200">/api/hardware</td>
                      <td className="py-3 px-4 font-mono text-emerald-400">GET</td>
                      <td className="py-3 px-4">Real-time CPU, RAM, and per-GPU snapshot</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-zinc-200">/ws/live</td>
                      <td className="py-3 px-4 font-mono text-purple-400">WebSocket</td>
                      <td className="py-3 px-4">Live telemetry stream (losses, metrics, hardware events)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Publishing */}
            <section id="publishing" className="space-y-4 pt-6 border-t border-white/[0.08]">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-sky-400" />
                <span>Publishing to Sentinel Hub</span>
              </h2>
              <p className="text-sm text-zinc-400">
                The registry is open. Publish a module with one command, or keep modules private in your own repository:
              </p>

              <div className="space-y-4">
                <div className="rounded-xl bg-[#0b0c10] border border-white/[0.1] p-4 font-mono text-xs">
                  <div className="text-zinc-400 font-sans mb-1 font-medium">Publish to the open community registry:</div>
                  <pre className="text-sky-300">sentinel push components/my-model.yaml</pre>
                  <p className="text-zinc-500 font-sans mt-2 text-[11px]">
                    Validates nodes, edges, and parameters, then stages your module for the community registry.
                  </p>
                </div>

                <div className="rounded-xl bg-[#0b0c10] border border-white/[0.1] p-4 font-mono text-xs">
                  <div className="text-zinc-400 font-sans mb-1 font-medium">Configure a private team space:</div>
                  <pre className="text-sky-300">sentinel config set space https://github.com/my-org/sentinel-space</pre>
                  <p className="text-zinc-500 font-sans mt-2 text-[11px]">
                    Use a private GitHub or GitLab repository for internal modules and policies.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
