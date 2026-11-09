"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  Search,
  ArrowLeft,
  Boxes,
  Terminal,
  Sparkles,
} from "lucide-react";

function SentinelLogo({ size = 28 }: { size?: number }) {
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
        <linearGradient id="sentinel-cat-grad" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <filter id="sentinel-cat-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        x="1.5"
        y="1.5"
        width="33"
        height="33"
        rx="8.5"
        fill="#090a0f"
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth="1"
      />

      <rect
        x="2.5"
        y="2.5"
        width="31"
        height="31"
        rx="7.5"
        fill="none"
        stroke="rgba(56, 189, 248, 0.09)"
        strokeWidth="1"
      />

      <g filter="url(#sentinel-cat-glow)">
        <path
          d="M 23.5 11.5 H 15.5 L 10.5 16.5"
          stroke="url(#sentinel-cat-grad)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 12 15.5 L 24 20.5"
          stroke="url(#sentinel-cat-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M 25.5 19.5 L 20.5 24.5 H 12.5"
          stroke="url(#sentinel-cat-grad)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="23.5" cy="11.5" r="2.4" fill="#090a0f" stroke="url(#sentinel-cat-grad)" strokeWidth="1.8" />
        <circle cx="23.5" cy="11.5" r="1.1" fill="#38bdf8" />
        <circle cx="12.5" cy="24.5" r="2.4" fill="#090a0f" stroke="url(#sentinel-cat-grad)" strokeWidth="1.8" />
        <circle cx="12.5" cy="24.5" r="1.1" fill="#10b981" />
      </g>
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const GITHUB_REPO_URL = "https://github.com/rimraf-adi/sentinel";

export type CatalogItem = {
  id: string;
  name: string;
  kind: "component" | "template";
  domain: string;
  specs: string;
  desc: string;
  cmd: string;
  author?: string;
};

const CATALOG_ITEMS: CatalogItem[] = [
  // ==========================================
  // COMPONENTS (Neural network graphs and DAGs)
  // ==========================================
  {
    id: "vision/vit-tiny@v1",
    name: "ViT Tiny",
    kind: "component",
    domain: "Vision",
    specs: "112K params · 1.39 MMACs",
    desc: "Patch embedding with multi-head self-attention blocks tuned for low-latency edge vision inference.",
    cmd: "sentinel component show vision/vit-tiny@v1",
  },
  {
    id: "vision/resnet-mini@v1",
    name: "ResNet Mini",
    kind: "component",
    domain: "Vision",
    specs: "3 stages · Residual bottlenecks",
    desc: "Classic residual learning stack with skip connection highways and batch normalization.",
    cmd: "sentinel component show vision/resnet-mini@v1",
  },
  {
    id: "vision/unet@v1",
    name: "U-Net",
    kind: "component",
    domain: "Vision",
    specs: "Contracting & Expanding Paths",
    desc: "Symmetric encoder-decoder topology with skip connections and channel projection layers for pixel-wise segmentation.",
    cmd: "sentinel component show vision/unet@v1",
  },
  {
    id: "vision/cnn-classifier@v1",
    name: "CNN Classifier",
    kind: "component",
    domain: "Vision",
    specs: "Conv2D + MaxPool + Linear",
    desc: "Standard convolutional feature extractor with adaptive average pooling and dense classification head.",
    cmd: "sentinel component show vision/cnn-classifier@v1",
  },
  {
    id: "tabular/deep-residual-mlp@v1",
    name: "Deep Residual MLP",
    kind: "component",
    domain: "Tabular",
    specs: "Multi-stage residual blocks",
    desc: "Dense residual highway with LayerNorm, GELU activations, and automated compile-time shape inference.",
    cmd: "sentinel component check components/tabular/deep-residual-mlp.yaml",
  },
  {
    id: "tabular/residual-mlp@v1",
    name: "Residual MLP",
    kind: "component",
    domain: "Tabular",
    specs: "Single-stage skip connection",
    desc: "Lightweight feedforward architecture with linear skip bridges for structured tabular datasets.",
    cmd: "sentinel component check components/tabular/residual-mlp.yaml",
  },
  {
    id: "tabular/ann-classifier@v1",
    name: "ANN Classifier",
    kind: "component",
    domain: "Tabular",
    specs: "Multi-layer perceptron",
    desc: "Standard dense neural network with dropout regularization and cross-entropy loss calibration.",
    cmd: "sentinel component check components/tabular/ann-classifier.yaml",
  },
  {
    id: "sequence/transformer-classifier@v1",
    name: "Transformer Classifier",
    kind: "component",
    domain: "Sequence",
    specs: "RoPE + Causal Multi-Head Attn",
    desc: "Rotary Position Embeddings and causal multi-head self-attention stack for sequence classification.",
    cmd: "sentinel component show sequence/transformer-classifier@v1",
  },
  {
    id: "sequence/lstm-classifier@v1",
    name: "LSTM Classifier",
    kind: "component",
    domain: "Sequence",
    specs: "Bi-directional recurrent cells",
    desc: "Recurrent neural network with hidden state persistence for time-series and token sequence modeling.",
    cmd: "sentinel component show sequence/lstm-classifier@v1",
  },
  {
    id: "generative/vae@v1",
    name: "Variational Autoencoder",
    kind: "component",
    domain: "Generative",
    specs: "Latent Reparameterization",
    desc: "Convolutional encoder-decoder pair with KL-divergence loss scheduling and Gaussian sampling.",
    cmd: "sentinel component show generative/vae@v1",
  },
  {
    id: "generative/gan@v1",
    name: "Generative Adversarial Network",
    kind: "component",
    domain: "Generative",
    specs: "Generator + Discriminator",
    desc: "Minimax adversarial training pair with non-saturating loss and gradient penalty stabilization.",
    cmd: "sentinel component show generative/gan@v1",
  },
  {
    id: "graph/gcn-classifier@v1",
    name: "Graph ConvNet",
    kind: "component",
    domain: "Graph",
    specs: "Spectral graph convolution",
    desc: "Edge dropout and symmetric adjacency normalization with isolated memory management.",
    cmd: "sentinel component show graph/gcn-classifier@v1",
  },
  {
    id: "speech/conformer-ctc@v1",
    name: "Conformer CTC ASR",
    kind: "component",
    domain: "Speech",
    specs: "Log-Mel Frontend · 12-Layer Conformer · CTC Loss",
    desc: "End-to-end streaming Conformer ASR trained from scratch with LogMel front-end, SpecAugment, and CTC decoding.",
    cmd: "sentinel component show speech/conformer-ctc@v1",
    author: "Aditya Kinjawadekar",
  },

  // ==========================================
  // TEMPLATES (Full pipelines & training recipes)
  // ==========================================
  {
    id: "speech/marathi-asr@v1",
    name: "Marathi Multi-Dialect MoE ASR",
    kind: "template",
    domain: "Speech",
    specs: "4 Dialects · 3-Expert MoE Trunk · Multi-Exit CTC",
    desc: "End-to-end multi-stage training pipeline from scratch: SSL masked reconstruction pretraining, causal dynamic chunking, and 4-dialect Sparse MoE adaptation.",
    cmd: "sentinel add speech/marathi-asr@v1",
    author: "Aditya Kinjawadekar",
  },
  {
    id: "llm/lora-finetune@v1",
    name: "LoRA Fine-Tune (LLM)",
    kind: "template",
    domain: "LLM",
    specs: "PEFT LoRA · bfloat16 · Optuna ASHA Sweeps",
    desc: "Production parameter-efficient fine-tuning template for lightweight open-source language models with automated learning rate sweeps and crash-safe MLflow tracking.",
    cmd: "sentinel add llm/lora-finetune@v1",
  },
  {
    id: "custom/starter@v1",
    name: "Blank Custom Recipe",
    kind: "template",
    domain: "Custom",
    specs: "Standalone Python · Optuna ASHA · MLflow",
    desc: "Standard starter blueprint for custom PyTorch recipes with daemon supervision, automated hyperparameter optimization, and checkpointing.",
    cmd: "sentinel add custom/starter@v1",
  },
  {
    id: "custom/command-runner@v1",
    name: "Command Adapter",
    kind: "template",
    domain: "Custom",
    specs: "Zero-Touch CLI Wrap",
    desc: "Adapter template allowing any existing bash or Python training command to run under Sentinel process supervision and live hardware telemetry.",
    cmd: "sentinel add custom/command-runner@v1",
  },
];

export default function CatalogPage() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "component" | "template">("all");
  const [activeDomain, setActiveDomain] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const counts = useMemo(() => {
    return {
      all: CATALOG_ITEMS.length,
      component: CATALOG_ITEMS.filter((t) => t.kind === "component").length,
      template: CATALOG_ITEMS.filter((t) => t.kind === "template").length,
    };
  }, []);

  const filtered = useMemo(() => {
    return CATALOG_ITEMS.filter((t) => {
      const matchesKind = activeTab === "all" || t.kind === activeTab;
      const matchesDomain =
        activeDomain === "all" || t.domain.toLowerCase() === activeDomain.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.specs.toLowerCase().includes(q);

      return matchesKind && matchesDomain && matchesSearch;
    });
  }, [activeTab, activeDomain, searchQuery]);

  return (
    <div className="min-h-screen bg-[#070709] text-[#ececee] selection:bg-sky-500/25 selection:text-white relative font-sans">
      <div className="fixed inset-0 pointer-events-none -z-10 bg-grid opacity-50" />

      {/* Floating Header */}
      <header className="sticky top-4 z-50 px-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/[0.08] bg-[#0a0a0f]/85 px-4 sm:px-6 py-2.5 backdrop-blur-xl shadow-2xl transition-all">
          <Link href="/" className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <SentinelLogo size={22} />
            <span className="text-[14px] font-semibold tracking-tight text-white">sentinel</span>
            <span className="text-neutral-500 text-xs">/ catalog</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="text-xs text-neutral-400 hover:text-white transition-colors hidden sm:inline"
            >
              Docs
            </Link>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Catalog Content */}
      <main className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        {/* Title & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.06]">
          <div>
            <div className="text-xs font-mono text-sky-400 uppercase tracking-widest flex items-center gap-2">
              <span>SENTINEL HUB REGISTRY</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">v1.2</span>
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-normal tracking-tight text-white">
              Components &amp; Templates
            </h1>
            <p className="mt-2 text-sm text-neutral-400 max-w-xl leading-relaxed">
              Explore neural network graph components for custom architectures, and full training templates for automated pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0c0d12] border border-white/10 rounded-lg px-3 py-2 w-full md:w-72 shadow-inner">
            <Search className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search components or templates…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-neutral-500 outline-none w-full font-mono"
            />
          </div>
        </div>

        {/* Primary View Toggle: Components vs Templates */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "all"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              All Items ({counts.all})
            </button>
            <button
              onClick={() => setActiveTab("component")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "component"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Components ({counts.component})</span>
            </button>
            <button
              onClick={() => setActiveTab("template")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "template"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Templates ({counts.template})</span>
            </button>
          </div>

          <div className="text-xs font-mono text-zinc-400 hidden sm:block">
            {activeTab === "all" && "Showing all building blocks and full pipelines"}
            {activeTab === "component" && "Neural architectures & DAG blocks (sentinel component show)"}
            {activeTab === "template" && "Ready-to-train blueprints & pipelines (sentinel add)"}
          </div>
        </div>

        {/* Domain Filters */}
        <div className="flex items-center gap-1.5 py-6 overflow-x-auto border-b border-white/[0.04]">
          {["all", "speech", "vision", "tabular", "sequence", "generative", "graph", "llm", "custom"].map((domain) => (
            <button
              key={domain}
              onClick={() => setActiveDomain(domain)}
              className={`px-3 py-1 rounded-full text-xs capitalize transition-all whitespace-nowrap font-mono ${
                activeDomain === domain
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-medium"
                  : "bg-white/5 border border-white/10 text-neutral-400 hover:text-white"
              }`}
            >
              {domain}
            </button>
          ))}
          <span className="ml-auto text-xs font-mono text-neutral-500 hidden sm:inline">
            Showing {filtered.length} results
          </span>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {filtered.map((t) => {
            const isTemplate = t.kind === "template";

            return (
              <div
                key={t.id}
                className={`rounded-xl border p-5 transition-all flex flex-col justify-between ${
                  isTemplate
                    ? "bg-[#0d0c14] border-purple-500/20 hover:border-purple-500/40 shadow-sm"
                    : "bg-[#0c0d12] border-white/10 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-neutral-400 truncate">{t.id}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-semibold tracking-wider ${
                          isTemplate
                            ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                            : "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                        }`}
                      >
                        {isTemplate ? "TEMPLATE" : "COMPONENT"}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 uppercase">
                        {t.domain}
                      </span>
                    </div>
                  </div>

                  <h2 className="mt-2.5 text-base font-medium text-white flex items-center justify-between">
                    <span>{t.name}</span>
                    {t.author && (
                      <span className="text-[10px] font-mono text-zinc-500 font-normal">
                        by {t.author}
                      </span>
                    )}
                  </h2>

                  <p className="mt-1 text-xs font-mono text-sky-400">{t.specs}</p>
                  <p className="mt-2 text-xs text-neutral-400 leading-relaxed">{t.desc}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <code className="text-[11px] font-mono text-neutral-300 truncate max-w-[280px]">
                    {t.cmd}
                  </code>
                  <button
                    onClick={() => copyToClipboard(t.cmd, t.id)}
                    className="flex items-center gap-1 rounded bg-white/5 hover:bg-white/10 px-2.5 py-1 text-xs text-neutral-300 hover:text-white transition-all flex-shrink-0 border border-white/5"
                    title="Copy command"
                  >
                    {copiedCmd === t.id ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-zinc-500 text-sm font-mono">
            No {activeTab !== "all" ? activeTab + "s" : "items"} found matching &ldquo;{searchQuery}&rdquo; in domain &ldquo;{activeDomain}&rdquo;.
          </div>
        )}

        {/* CLI Usage Notice */}
        <div className="mt-14 rounded-xl border border-white/10 bg-[#0a0a0f] p-6 text-xs font-mono text-neutral-400 space-y-3">
          <div className="text-white font-medium flex items-center gap-2">
            <Terminal className="h-4 w-4 text-sky-400" />
            <span>CLI Hierarchy &amp; Resolution</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs text-neutral-400">
            <div className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
              <div className="text-sky-400 font-mono text-[11px] font-semibold mb-1">
                COMPONENTS
              </div>
              <p>
                Discrete neural network graphs and DAGs. Inspect layer connections and compile-time shapes via <code className="text-white font-mono">sentinel component show &lt;id&gt;</code>.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
              <div className="text-purple-400 font-mono text-[11px] font-semibold mb-1">
                TEMPLATES
              </div>
              <p>
                Complete end-to-end training pipelines and curriculum recipes. Scaffold directly into your project with <code className="text-white font-mono">sentinel add &lt;id&gt;</code>.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 text-xs text-neutral-500">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <span>Sentinel Open Source · Apache 2.0 / MIT</span>
          <Link href="/" className="hover:text-white transition-colors">
            ← Return to Homepage
          </Link>
        </div>
      </footer>
    </div>
  );
}
