"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import integrationsData from "../../../integrations.json";
import { 
  Terminal, 
  Copy, 
  Check, 
  Package, 
  ArrowLeft, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Zap,
  Sliders,
  Sparkles,
  BarChart3
} from "lucide-react";

export default function IntegrationsDocPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const packs = integrationsData.integrations;

  return (
    <div className="flex flex-col min-h-screen bg-[#070709] text-zinc-100">
      <Navbar activePage="integrations" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Documentation</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Capability Packs & Integrations
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Capability Packs Installation & Hooks
          </h1>
          <p className="text-base text-zinc-300 leading-relaxed max-w-3xl">
            Capability packs are modular diagnostic, optimization, and export extensions for Sentinel. They run natively alongside your training process without burdening the lightweight 15 MB Rust supervisor.
          </p>
        </div>

        {/* Architecture Note */}
        <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-white mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Decoupled Hook Architecture</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Packs execute hooks via <code className="text-zinc-300 font-mono">sentinel-sdk</code> during training callbacks. Disk errors, GPU driver timeouts, or unhandled exceptions in packs are caught safely so training loops never crash.
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-400 px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06]">
            sentinel pack list
          </div>
        </div>

        {/* The 5 Packs Detailed */}
        <section className="space-y-6 mb-16">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-sky-400" />
            <span>Available Capability Packs</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Explainability and Remediation */}
            <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0b0c10] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  interpretability
                </span>
                <span className="text-xs font-mono text-zinc-500">v1.0.0</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Explainability and Remediation</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Integrated Gradients, Grad-CAM, attention rollout, and suggested fixes for training problems. Analyzes topological loss landscape flatness and representation rank.
                </p>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <code className="text-xs font-mono text-sky-300">sentinel pack add xai</code>
                <button
                  onClick={() => copy("sentinel pack add xai", "p-xai")}
                  className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                >
                  {copiedId === "p-xai" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2. Gradient Flow */}
            <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0b0c10] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  observability
                </span>
                <span className="text-xs font-mono text-zinc-500">v1.0.0</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Gradient Flow</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Live gradient inspection with alerts for vanishing and exploding layers. Inspects layer-by-layer tensor norms and backpropagation dynamics.
                </p>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <code className="text-xs font-mono text-sky-300">sentinel pack add gradient-flow</code>
                <button
                  onClick={() => copy("sentinel pack add gradient-flow", "p-flow")}
                  className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                >
                  {copiedId === "p-flow" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 3. Hyperparameter Sweeps */}
            <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0b0c10] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  optimization
                </span>
                <span className="text-xs font-mono text-zinc-500">v1.0.0</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Hyperparameter Sweeps</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Parallel Optuna ASHA trials with early stopping and parameter importance. Dynamically reallocates GPU slots from stalled trials.
                </p>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <code className="text-xs font-mono text-sky-300">sentinel pack add sweeps</code>
                <button
                  onClick={() => copy("sentinel pack add sweeps", "p-sweeps")}
                  className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                >
                  {copiedId === "p-sweeps" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 4. EvalGuard */}
            <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0b0c10] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  governance
                </span>
                <span className="text-xs font-mono text-zinc-500">v1.0.0</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">EvalGuard</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Regression checks, slice metrics, and fairness gates before release. Enforces accuracy thresholds on critical test splits.
                </p>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <code className="text-xs font-mono text-sky-300">sentinel pack add eval-guard</code>
                <button
                  onClick={() => copy("sentinel pack add eval-guard", "p-guard")}
                  className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                >
                  {copiedId === "p-guard" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 5. Export and Quantization */}
            <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0b0c10] space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  deployment
                </span>
                <span className="text-xs font-mono text-zinc-500">v1.0.0</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Export and Quantization</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  ONNX conversion, FP16 and INT8 quantization, TensorRT engines. Automatically validates shape consistency and outputs benchmark latencies.
                </p>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <code className="text-xs font-mono text-sky-300">sentinel pack add export-quantization</code>
                <button
                  onClick={() => copy("sentinel pack add export-quantization", "p-export")}
                  className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                >
                  {copiedId === "p-export" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Hook Lifecycle */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Hook Lifecycle in Python Training</h2>
          <p className="text-sm text-zinc-400">
            Installed packs automatically hook into the standard training loop through <code className="text-sky-300">sentinel-sdk</code>:
          </p>

          <div className="relative rounded-xl bg-[#0b0c10] border border-white/[0.1] p-4 font-mono text-xs text-zinc-300">
            <pre className="overflow-x-auto">
{`import sentinel

run = sentinel.init(experiment_name="production-run", run_name="resnet-v1")

for epoch in range(10):
    for batch in dataloader:
        loss = model.train_step(batch)
        
        # Capability packs hook into run.log automatically
        run.log({"train/loss": loss.item()})
        
    run.log({"val/acc": eval_acc})

run.finish()`}
            </pre>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
