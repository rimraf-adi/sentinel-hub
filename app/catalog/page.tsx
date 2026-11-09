"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  Search,
  ArrowLeft,
  Boxes,
  Terminal,
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

const ALL_TEMPLATES = [
  {
    id: "vision/vit-tiny@v1",
    name: "ViT Tiny",
    domain: "Vision",
    specs: "112K params · 1.39 MMACs",
    desc: "Patch embedding with multi-head self-attention blocks tuned for low-latency edge vision inference.",
    cmd: "sentinel component show vision/vit-tiny@v1",
  },
  {
    id: "vision/resnet-mini@v1",
    name: "ResNet Mini",
    domain: "Vision",
    specs: "3 stages · Residual bottlenecks",
    desc: "Classic residual learning stack with skip connection highways and batch normalization.",
    cmd: "sentinel component show vision/resnet-mini@v1",
  },
  {
    id: "vision/unet@v1",
    name: "U-Net",
    domain: "Vision",
    specs: "Contracting & Expanding Paths",
    desc: "Symmetric encoder-decoder topology with skip connections and channel projection layers for pixel-wise segmentation.",
    cmd: "sentinel component show vision/unet@v1",
  },
  {
    id: "vision/cnn-classifier@v1",
    name: "CNN Classifier",
    domain: "Vision",
    specs: "Conv2D + MaxPool + Linear",
    desc: "Standard convolutional feature extractor with adaptive average pooling and dense classification head.",
    cmd: "sentinel component show vision/cnn-classifier@v1",
  },
  {
    id: "tabular/deep-residual-mlp@v1",
    name: "Deep Residual MLP",
    domain: "Tabular",
    specs: "Multi-stage residual blocks",
    desc: "Dense residual highway with LayerNorm, GELU activations, and automated compile-time shape inference.",
    cmd: "sentinel component check components/tabular/deep-residual-mlp.yaml",
  },
  {
    id: "tabular/residual-mlp@v1",
    name: "Residual MLP",
    domain: "Tabular",
    specs: "Single-stage skip connection",
    desc: "Lightweight feedforward architecture with linear skip bridges for structured tabular datasets.",
    cmd: "sentinel component check components/tabular/residual-mlp.yaml",
  },
  {
    id: "tabular/ann-classifier@v1",
    name: "ANN Classifier",
    domain: "Tabular",
    specs: "Multi-layer perceptron",
    desc: "Standard dense neural network with dropout regularization and cross-entropy loss calibration.",
    cmd: "sentinel component check components/tabular/ann-classifier.yaml",
  },
  {
    id: "sequence/transformer-classifier@v1",
    name: "Transformer Classifier",
    domain: "Sequence",
    specs: "RoPE + Causal Multi-Head Attn",
    desc: "Rotary Position Embeddings and causal multi-head self-attention stack for sequence classification.",
    cmd: "sentinel component show sequence/transformer-classifier@v1",
  },
  {
    id: "sequence/lstm-classifier@v1",
    name: "LSTM Classifier",
    domain: "Sequence",
    specs: "Bi-directional recurrent cells",
    desc: "Recurrent neural network with hidden state persistence for time-series and token sequence modeling.",
    cmd: "sentinel component show sequence/lstm-classifier@v1",
  },
  {
    id: "generative/vae@v1",
    name: "Variational Autoencoder",
    domain: "Generative",
    specs: "Latent Reparameterization",
    desc: "Convolutional encoder-decoder pair with KL-divergence loss scheduling and Gaussian sampling.",
    cmd: "sentinel component show generative/vae@v1",
  },
  {
    id: "generative/gan@v1",
    name: "Generative Adversarial Network",
    domain: "Generative",
    specs: "Generator + Discriminator",
    desc: "Minimax adversarial training pair with non-saturating loss and gradient penalty stabilization.",
    cmd: "sentinel component show generative/gan@v1",
  },
  {
    id: "graph/gcn-classifier@v1",
    name: "Graph ConvNet",
    domain: "Graph",
    specs: "Spectral graph convolution",
    desc: "Edge dropout and symmetric adjacency normalization with isolated memory management.",
    cmd: "sentinel component show graph/gcn-classifier@v1",
  },
  {
    id: "speech/conformer-ctc@v1",
    name: "Conformer CTC ASR",
    domain: "Speech",
    specs: "Log-Mel Frontend · 12-Layer Conformer · CTC Loss",
    desc: "End-to-end streaming Conformer ASR trained from scratch with LogMel front-end, SpecAugment, and CTC decoding. Authored by Aditya Kinjawadekar.",
    cmd: "sentinel add speech/conformer-ctc@v1",
  },
  {
    id: "speech/marathi-asr@v1",
    name: "Marathi Multi-Dialect MoE ASR",
    domain: "Speech",
    specs: "4 Dialects · 3-Expert MoE Trunk · Multi-Exit CTC",
    desc: "Marathi speech recognition trained from scratch featuring 4-dialect Sparse Mixture-of-Experts (Malvani, Ahirani, Varhadi, Standard) with multi-exit CTC decoders. Authored by Aditya Kinjawadekar.",
    cmd: "sentinel add speech/marathi-asr@v1",
  },
];

export default function CatalogPage() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeDomain, setActiveDomain] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const filtered = ALL_TEMPLATES.filter((t) => {
    const matchesDomain = activeDomain === "all" || t.domain.toLowerCase() === activeDomain.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.06]">
          <div>
            <div className="text-xs font-mono text-sky-400 uppercase tracking-widest">
              COMPONENT REGISTRY
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-normal tracking-tight text-white">
              Model Architecture Catalog
            </h1>
            <p className="mt-2 text-sm text-neutral-400 max-w-xl">
              Verified deep learning architectures available in Sentinel. Inspect parameter counts, verify tensor shapes, or export to standalone PyTorch.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0c0d12] border border-white/10 rounded-lg px-3 py-1.5 w-full md:w-64">
            <Search className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search components…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-neutral-500 outline-none w-full font-mono"
            />
          </div>
        </div>

        {/* Domain Filters */}
        <div className="flex items-center gap-1.5 py-6 overflow-x-auto">
          {["all", "speech", "vision", "tabular", "sequence", "generative", "graph"].map((domain) => (
            <button
              key={domain}
              onClick={() => setActiveDomain(domain)}
              className={`px-3 py-1 rounded-full text-xs capitalize transition-all whitespace-nowrap font-mono ${
                activeDomain === domain
                  ? "bg-white text-black font-medium"
                  : "bg-white/5 border border-white/10 text-neutral-400 hover:text-white"
              }`}
            >
              {domain}
            </button>
          ))}
          <span className="ml-auto text-xs font-mono text-neutral-500 hidden sm:inline">
            Showing {filtered.length} components
          </span>
        </div>

        {/* Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-white/10 bg-[#0c0d12] p-5 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-neutral-400">{t.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 uppercase">
                    {t.domain}
                  </span>
                </div>
                <h2 className="mt-2 text-base font-medium text-white">{t.name}</h2>
                <p className="mt-1 text-xs font-mono text-sky-400">{t.specs}</p>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">{t.desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
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
          ))}
        </div>

        {/* CLI Usage Notice */}
        <div className="mt-14 rounded-xl border border-white/10 bg-[#0a0a0f] p-6 text-xs font-mono text-neutral-400 space-y-2">
          <div className="text-white font-medium flex items-center gap-2">
            <Terminal className="h-4 w-4 text-sky-400" />
            <span>CLI Hierarchy Discovery</span>
          </div>
          <p className="text-neutral-400 font-sans">
            Models resolve across three discovery tiers: Embedded Built-in, User templates in <code className="text-neutral-200">~/.sentinel/templates</code>, and project-local overrides in <code className="text-neutral-200">./components</code>.
          </p>
          <div className="pt-2 text-neutral-300">
            $ sentinel component list
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
