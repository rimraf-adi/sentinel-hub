"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
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
  Network
} from "lucide-react";

export default function DocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070709] text-zinc-100">
      <Navbar activePage="docs" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Docs Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                Getting Started
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#overview" className="text-sky-400 hover:text-sky-300 font-medium">Overview</a>
                </li>
                <li>
                  <a href="#quickstart" className="text-zinc-400 hover:text-zinc-200">Installation</a>
                </li>
                <li>
                  <a href="#architecture" className="text-zinc-400 hover:text-zinc-200">Architecture</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                Guides & Specifications
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/docs/templates" className="text-zinc-400 hover:text-sky-300 flex items-center justify-between">
                    <span>Templates Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                  </Link>
                </li>
                <li>
                  <Link href="/docs/integrations" className="text-zinc-400 hover:text-sky-300 flex items-center justify-between">
                    <span>Integrations & Packs</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                  </Link>
                </li>
                <li>
                  <a href="#modular-blocks" className="text-zinc-400 hover:text-zinc-200">Modular Blocks YAML</a>
                </li>
                <li>
                  <a href="#cli-reference" className="text-zinc-400 hover:text-zinc-200">CLI Reference</a>
                </li>
                <li>
                  <a href="#http-api" className="text-zinc-400 hover:text-zinc-200">REST & WebSocket API</a>
                </li>
                <li>
                  <a href="#publishing" className="text-zinc-400 hover:text-zinc-200">Publishing to Registry</a>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Lock-In Guarantee</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Export any template to a plain PyTorch script with no Sentinel runtime dependencies.
              </p>
            </div>
          </aside>

          {/* Main Docs Content */}
          <div className="lg:col-span-3 space-y-16">
            {/* Overview */}
            <section id="overview" className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Documentation · Core Architecture
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Sentinel Hub Documentation
              </h1>
              <p className="text-base text-zinc-300 leading-relaxed max-w-3xl">
                Sentinel is a lightweight training supervisor and ML operations plane designed for coding agents and ML teams. Models are defined as declarative YAML graphs that compile to clean PyTorch modules, while an asynchronous Rust microkernel supervises execution, allocates GPUs, and streams telemetry without overhead.
              </p>
            </section>

            {/* Quickstart / Installation */}
            <section id="quickstart" className="space-y-4 pt-6 border-t border-white/[0.08]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-sky-400" />
                <span>Installation & Quick Start</span>
              </h2>
              <p className="text-sm text-zinc-400">
                Requires Rust 1.75+, Python 3.10+, and <a href="https://github.com/astral-sh/uv" target="_blank" rel="noreferrer" className="text-sky-400 underline">uv</a>.
              </p>

              <div className="relative rounded-xl bg-[#0b0c10] border border-white/[0.1] p-4 font-mono text-xs text-zinc-200">
                <button
                  onClick={() => copy("curl -fsSL https://raw.githubusercontent.com/rimraf-adi/sentinel/main/install.sh | bash", "install-docs")}
                  className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                  title="Copy command"
                >
                  {copiedId === "install-docs" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre className="overflow-x-auto text-zinc-300">
{`# 1. Single-command installer (macOS & Linux)
curl -fsSL https://raw.githubusercontent.com/rimraf-adi/sentinel/main/install.sh | bash

# Or via Cargo directly:
cargo install --git https://github.com/rimraf-adi/sentinel.git sentinel-cli

# 2. Launch the supervisor dashboard
sentinel dev  # active at http://localhost:2512`}
                </pre>
              </div>

              <p className="text-xs text-zinc-400">
                Run <code className="text-sky-300 bg-white/[0.05] px-1.5 py-0.5 rounded">sentinel doctor</code> to verify your Python and PyTorch runtime environment.
              </p>
            </section>

            {/* Architecture Plane */}
            <section id="architecture" className="space-y-4 pt-6 border-t border-white/[0.08]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
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
                      <td className="py-3 px-4 font-semibold text-white">Control</td>
                      <td className="py-3 px-4 font-mono text-amber-400">Rust</td>
                      <td className="py-3 px-4">Process supervision, GPU allocation (NVML), telemetry streaming, component resolution, embedded dashboard, REST/WebSocket API</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-white">Execution</td>
                      <td className="py-3 px-4 font-mono text-sky-400">Python</td>
                      <td className="py-3 px-4">Training loops and sweeps (PyTorch, Hugging Face, Optuna), launched with uv run, logging through sentinel-sdk</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Modular Blocks Specification */}
            <section id="modular-blocks" className="space-y-4 pt-6 border-t border-white/[0.08]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-sky-400" />
                <span>Modular Blocks Specification</span>
              </h2>
              <p className="text-sm text-zinc-400">
                Models in Sentinel are composed of compound and fundamental blocks. Input shapes are inferred from wiring, and compounds compile into nested PyTorch classes:
              </p>

              <div className="relative rounded-xl bg-[#0b0c10] border border-white/[0.1] p-4 font-mono text-xs">
                <div className="text-zinc-500 mb-2 font-mono"># blocks/core/residual_mlp_block.yaml</div>
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
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
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
                      <td className="py-3 px-4 text-sky-400">sentinel template …</td>
                      <td className="py-3 px-4 font-sans text-zinc-300">list, add, remove, dir</td>
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

            {/* HTTP API */}
            <section id="http-api" className="space-y-4 pt-6 border-t border-white/[0.08]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-sky-400" />
                <span>HTTP & WebSocket API</span>
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
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
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
