"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Search,
  ArrowLeft,
  Boxes,
  Terminal,
  Sparkles,
  X,
  Upload,
  ArrowRight,
  ChevronRight,
  Layers,
  Cpu,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Play,
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

export type DiagramNode = {
  id: string;
  label: string;
  sub?: string;
  shape?: string;
  badge?: "input" | "core" | "routing" | "loss" | "output";
};

export type CatalogItem = {
  id: string;
  name: string;
  kind: "component" | "template";
  domain: string;
  specs: string;
  desc: string;
  cmd: string;
  author?: string;
  tags?: string[];
  specsDetail?: {
    inputs?: string;
    loss?: string;
    optimizer?: string;
    checkpoint?: string;
    resume?: string;
    parameters?: string;
  };
  diagram: DiagramNode[];
  yamlSnippet: string;
};

const CATALOG_ITEMS: CatalogItem[] = [
  // ==========================================
  // SPEECH TEMPLATES & COMPONENTS
  // ==========================================
  {
    id: "speech/marathi-asr@v1",
    name: "Marathi Multi-Dialect MoE ASR",
    kind: "template",
    domain: "Speech",
    specs: "4 Dialects · 3-Expert MoE Trunk · Multi-Exit CTC",
    desc: "End-to-end multi-stage training pipeline from scratch: SSL masked reconstruction pretraining, causal dynamic chunking, and 4-dialect Sparse MoE adaptation (Malvani, Ahirani, Varhadi, Standard).",
    cmd: "sentinel add speech/marathi-asr@v1",
    author: "Aditya Kinjawadekar",
    tags: ["speech", "marathi", "moe", "ctc", "conformer", "multi-dialect"],
    specsDetail: {
      inputs: "16kHz Mono Audio (WAV / FLAC)",
      loss: "CTC Loss + Masked L1 Reconstruction",
      optimizer: "AdamW (lr=0.0001, beta1=0.9, beta2=0.98)",
      checkpoint: "latest (atomic swap) / all",
      resume: "true (automatic restore state & epoch)",
      parameters: "3 Experts · 12 Conformer Layers · Vocab: 113",
    },
    diagram: [
      { id: "1", label: "Raw Audio", sub: "16kHz Mono PCM WAV", badge: "input" },
      { id: "2", label: "Log-Mel Spectrogram", sub: "80 Mel Filterbanks", badge: "core" },
      { id: "3", label: "SpecAugment & Dynamic Chunking", sub: "Causal Time/Freq Masking", badge: "core" },
      { id: "4", label: "Sparse MoE Gating Router", sub: "Top-1 Dynamic Dispatch (4 Dialects)", badge: "routing" },
      { id: "5", label: "3-Expert Conformer Trunk", sub: "Malvani / Ahirani / Varhadi / Std", badge: "core" },
      { id: "6", label: "Multi-Exit CTC Loss", sub: "Blank-penalty alignment", badge: "loss" },
      { id: "7", label: "Marathi Text Transcript", sub: "Devanagari Char Tokens", badge: "output" },
    ],
    yamlSnippet: `schema_version: "1.0"
component_id: "speech/marathi-asr@v1"
name: "Marathi Multi-Dialect MoE ASR"
author: "Aditya Kinjawadekar"
domain: "speech"
parameters:
  feat_dim: { type: int, default: 80, help: "Log-Mel filterbanks" }
  d_model: { type: int, default: 256, help: "Conformer hidden size" }
  num_layers: { type: int, default: 12, help: "Encoder layers" }
  num_experts: { type: int, default: 3, help: "Dialect experts" }
  vocab_size: { type: int, default: 113, help: "Devanagari character count" }
training:
  checkpoint: latest
  resume: true
  loss: { name: "ctc_loss" }
  optimizer: { name: "adamw", lr: 0.0001 }`,
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
    tags: ["speech", "conformer", "ctc", "streaming", "attention"],
    specsDetail: {
      inputs: "[B, T] Raw Audio @ 16kHz",
      loss: "Connectionist Temporal Classification (CTC)",
      optimizer: "AdamW (lr=0.0002, cosine decay)",
      checkpoint: "latest (crash-safe)",
      resume: "true",
      parameters: "12 Conformer Blocks · 4 Attention Heads",
    },
    diagram: [
      { id: "1", label: "Input Audio Signal", sub: "[B, T] 16kHz PCM", badge: "input" },
      { id: "2", label: "LogMel Filterbanks", sub: "[B, T', 80] Mel Features", badge: "core" },
      { id: "3", label: "2D Conv Subsampling", sub: "4x Temporal Stride", badge: "core" },
      { id: "4", label: "12x Conformer Blocks", sub: "Macaron FFN + MHA + Conv", badge: "core" },
      { id: "5", label: "Linear Projection", sub: "Hidden -> Vocab Logits", badge: "loss" },
      { id: "6", label: "CTC Decoder Output", sub: "Aligned Token Sequence", badge: "output" },
    ],
    yamlSnippet: `schema_version: "1.0"
component_id: "speech/conformer-ctc@v1"
name: "Conformer CTC ASR"
author: "Aditya Kinjawadekar"
domain: "speech"
parameters:
  feat_dim: { type: int, default: 80 }
  d_model: { type: int, default: 256 }
  num_layers: { type: int, default: 12 }
  n_heads: { type: int, default: 4 }
graph:
  inputs: { audio: [B, T] }
  outputs: { logits: head }`,
  },

  // ==========================================
  // VISION COMPONENTS
  // ==========================================
  {
    id: "vision/vit-tiny@v1",
    name: "ViT Tiny",
    kind: "component",
    domain: "Vision",
    specs: "112K params · 1.39 MMACs",
    desc: "Patch embedding with multi-head self-attention blocks tuned for low-latency edge vision inference.",
    cmd: "sentinel component show vision/vit-tiny@v1",
    tags: ["vision", "transformer", "attention", "classification"],
    specsDetail: {
      inputs: "[B, 3, 32, 32] RGB Image",
      loss: "Cross Entropy Loss",
      optimizer: "Adam (lr=0.001)",
      checkpoint: "latest",
      resume: "true",
      parameters: "dim=64, heads=4, ff=128, patch=8",
    },
    diagram: [
      { id: "1", label: "Image Input", sub: "[B, 3, 32, 32]", badge: "input" },
      { id: "2", label: "Patch Embedding", sub: "Conv2D patch=8 -> [B, 16, 64]", badge: "core" },
      { id: "3", label: "CLS Token & Pos Embed", sub: "Token prepended -> [B, 17, 64]", badge: "core" },
      { id: "4", label: "2x Transformer Blocks", sub: "Multi-Head Attention + GELU FFN", badge: "core" },
      { id: "5", label: "LayerNorm & CLS Select", sub: "Pool representation [B, 64]", badge: "core" },
      { id: "6", label: "Classification Head", sub: "Linear -> Logits [B, 10]", badge: "output" },
    ],
    yamlSnippet: `component_id: "vision/vit-tiny@v1"
domain: "vision"
parameters:
  patch: { default: 8 }
  dim: { default: 64 }
  heads: { default: 4 }
graph:
  inputs: { img: [B, 3, 32, 32] }
  edges: ["img -> patches", "patches -> cls", "cls -> pos", "pos -> t1", "t1 -> t2", "t2 -> norm", "norm -> pick", "pick -> head"]`,
  },
  {
    id: "vision/unet@v1",
    name: "U-Net",
    kind: "component",
    domain: "Vision",
    specs: "Contracting & Expanding Paths",
    desc: "Symmetric encoder-decoder topology with skip connections and channel projection layers for pixel-wise segmentation.",
    cmd: "sentinel component show vision/unet@v1",
    tags: ["vision", "segmentation", "skip-connections", "unet"],
    specsDetail: {
      inputs: "[B, 3, 256, 256] RGB Image",
      loss: "Dice Loss / Binary Cross Entropy",
      optimizer: "AdamW (lr=0.0003)",
      checkpoint: "latest",
      resume: "true",
      parameters: "Channels: [64, 128, 256, 512]",
    },
    diagram: [
      { id: "1", label: "Input Image", sub: "[B, 3, 256, 256]", badge: "input" },
      { id: "2", label: "Contracting Path", sub: "Conv2D + MaxPool Stages", badge: "core" },
      { id: "3", label: "Latent Bottleneck", sub: "Dense feature representations", badge: "core" },
      { id: "4", label: "Expanding Path + Skips", sub: "UpConv + Skip Concatenations", badge: "routing" },
      { id: "5", label: "1x1 Conv Head", sub: "Pixel-wise Segmentation Map", badge: "output" },
    ],
    yamlSnippet: `component_id: "vision/unet@v1"
domain: "vision"
graph:
  inputs: { img: [B, 3, 256, 256] }
  outputs: { mask: head }`,
  },
  {
    id: "vision/resnet-mini@v1",
    name: "ResNet Mini",
    kind: "component",
    domain: "Vision",
    specs: "3 stages · Residual bottlenecks",
    desc: "Classic residual learning stack with skip connection highways and batch normalization.",
    cmd: "sentinel component show vision/resnet-mini@v1",
    tags: ["vision", "resnet", "residual", "classification"],
    specsDetail: {
      inputs: "[B, 3, 32, 32]",
      loss: "Cross Entropy",
      optimizer: "SGD (lr=0.01, momentum=0.9)",
      checkpoint: "latest",
      resume: "true",
      parameters: "3 Residual Highway Stages",
    },
    diagram: [
      { id: "1", label: "Input Image", sub: "[B, 3, 32, 32]", badge: "input" },
      { id: "2", label: "Stem Conv", sub: "3x3 Conv + BatchNorm + ReLU", badge: "core" },
      { id: "3", label: "3x Residual Stages", sub: "Bottleneck Highway Blocks", badge: "core" },
      { id: "4", label: "Adaptive Avg Pool", sub: "Spatial reduction to [B, C]", badge: "core" },
      { id: "5", label: "Dense Classifier", sub: "Logits [B, Classes]", badge: "output" },
    ],
    yamlSnippet: `component_id: "vision/resnet-mini@v1"
domain: "vision"
graph:
  inputs: { img: [B, 3, 32, 32] }
  outputs: { logits: head }`,
  },
  {
    id: "vision/cnn-classifier@v1",
    name: "CNN Classifier",
    kind: "component",
    domain: "Vision",
    specs: "Conv2D + MaxPool + Linear",
    desc: "Standard convolutional feature extractor with adaptive average pooling and dense classification head.",
    cmd: "sentinel component show vision/cnn-classifier@v1",
    tags: ["vision", "cnn", "classification"],
    specsDetail: {
      inputs: "[B, 3, H, W]",
      loss: "Cross Entropy",
      optimizer: "Adam",
      checkpoint: "latest",
      resume: "true",
      parameters: "2 Conv Blocks + Linear Head",
    },
    diagram: [
      { id: "1", label: "Image Input", sub: "[B, 3, H, W]", badge: "input" },
      { id: "2", label: "Conv Block 1", sub: "Conv2D + BatchNorm + ReLU", badge: "core" },
      { id: "3", label: "Conv Block 2", sub: "Conv2D + MaxPool", badge: "core" },
      { id: "4", label: "Linear Classifier", sub: "Logits [B, C]", badge: "output" },
    ],
    yamlSnippet: `component_id: "vision/cnn-classifier@v1"
domain: "vision"
graph:
  inputs: { img: [B, 3, 28, 28] }
  outputs: { logits: head }`,
  },

  // ==========================================
  // TABULAR COMPONENTS
  // ==========================================
  {
    id: "tabular/deep-residual-mlp@v1",
    name: "Deep Residual MLP",
    kind: "component",
    domain: "Tabular",
    specs: "Multi-stage residual blocks",
    desc: "Dense residual highway with LayerNorm, GELU activations, and automated compile-time shape inference.",
    cmd: "sentinel component show tabular/deep-residual-mlp@v1",
    tags: ["tabular", "mlp", "residual", "classification"],
    specsDetail: {
      inputs: "[B, F] Structured Matrix",
      loss: "Cross Entropy / MSE",
      optimizer: "Adam (lr=0.01)",
      checkpoint: "latest",
      resume: "true",
      parameters: "2 Stacked Residual Blocks + GELU",
    },
    diagram: [
      { id: "1", label: "Tabular Features", sub: "[B, F] Dense Row Vector", badge: "input" },
      { id: "2", label: "Input Highway", sub: "Linear -> [B, Width]", badge: "core" },
      { id: "3", label: "Residual Block 1", sub: "Linear + LayerNorm + GELU + Skip", badge: "core" },
      { id: "4", label: "Residual Block 2", sub: "Linear + LayerNorm + GELU + Skip", badge: "core" },
      { id: "5", label: "Target Head", sub: "Classification or Regression Output", badge: "output" },
    ],
    yamlSnippet: `component_id: "tabular/deep-residual-mlp@v1"
domain: "tabular"
graph:
  inputs: { in: [B, F] }
  outputs: { out: head }`,
  },
  {
    id: "tabular/residual-mlp@v1",
    name: "Residual MLP",
    kind: "component",
    domain: "Tabular",
    specs: "Single-stage skip connection",
    desc: "Lightweight feedforward architecture with linear skip bridges for structured tabular datasets.",
    cmd: "sentinel component show tabular/residual-mlp@v1",
    tags: ["tabular", "mlp", "residual"],
    specsDetail: {
      inputs: "[B, F]",
      loss: "Cross Entropy",
      optimizer: "Adam (lr=0.005)",
      checkpoint: "latest",
      resume: "true",
      parameters: "Single Skip Bridge",
    },
    diagram: [
      { id: "1", label: "Features", sub: "[B, F]", badge: "input" },
      { id: "2", label: "Residual Skip Bridge", sub: "x + F(x)", badge: "core" },
      { id: "3", label: "Prediction Head", sub: "Target output", badge: "output" },
    ],
    yamlSnippet: `component_id: "tabular/residual-mlp@v1"
domain: "tabular"
graph:
  inputs: { in: [B, F] }
  outputs: { out: head }`,
  },
  {
    id: "tabular/ann-classifier@v1",
    name: "ANN Classifier",
    kind: "component",
    domain: "Tabular",
    specs: "Multi-layer perceptron",
    desc: "Standard dense neural network with dropout regularization and cross-entropy loss calibration.",
    cmd: "sentinel component show tabular/ann-classifier@v1",
    tags: ["tabular", "ann", "mlp"],
    specsDetail: {
      inputs: "[B, F]",
      loss: "Cross Entropy",
      optimizer: "Adam (lr=0.01)",
      checkpoint: "latest",
      resume: "true",
      parameters: "hidden=32, dropout=0.2",
    },
    diagram: [
      { id: "1", label: "Input Row", sub: "[B, F]", badge: "input" },
      { id: "2", label: "Dense Linear + ReLU", sub: "Hidden layer [B, 32]", badge: "core" },
      { id: "3", label: "Dropout Regularizer", sub: "p=0.2", badge: "core" },
      { id: "4", label: "Class Head", sub: "Logits [B, Classes]", badge: "output" },
    ],
    yamlSnippet: `component_id: "tabular/ann-classifier@v1"
domain: "tabular"
graph:
  inputs: { in: [B, F] }
  outputs: { out: head }`,
  },

  // ==========================================
  // SEQUENCE COMPONENTS
  // ==========================================
  {
    id: "sequence/transformer-classifier@v1",
    name: "Transformer Classifier",
    kind: "component",
    domain: "Sequence",
    specs: "RoPE + Causal Multi-Head Attn",
    desc: "Rotary Position Embeddings and causal multi-head self-attention stack for sequence classification.",
    cmd: "sentinel component show sequence/transformer-classifier@v1",
    tags: ["sequence", "transformer", "attention", "rope"],
    specsDetail: {
      inputs: "[B, T] Token IDs",
      loss: "Cross Entropy",
      optimizer: "AdamW",
      checkpoint: "latest",
      resume: "true",
      parameters: "RoPE Embeddings · 4 Attention Heads",
    },
    diagram: [
      { id: "1", label: "Token Stream", sub: "[B, T]", badge: "input" },
      { id: "2", label: "Rotary Embeddings (RoPE)", sub: "Position-aware vectors", badge: "core" },
      { id: "3", label: "Causal Multi-Head Attention", sub: "Masked self-attention", badge: "core" },
      { id: "4", label: "Linear Head", sub: "Classification Logits", badge: "output" },
    ],
    yamlSnippet: `component_id: "sequence/transformer-classifier@v1"
domain: "sequence"
graph:
  inputs: { tokens: [B, T] }
  outputs: { logits: head }`,
  },
  {
    id: "sequence/lstm-classifier@v1",
    name: "LSTM Classifier",
    kind: "component",
    domain: "Sequence",
    specs: "Bi-directional recurrent cells",
    desc: "Recurrent neural network with hidden state persistence for time-series and token sequence modeling.",
    cmd: "sentinel component show sequence/lstm-classifier@v1",
    tags: ["sequence", "lstm", "recurrent"],
    specsDetail: {
      inputs: "[B, T, F] Sequence Vector",
      loss: "Cross Entropy / MSE",
      optimizer: "Adam",
      checkpoint: "latest",
      resume: "true",
      parameters: "hidden=64, bidirectional=false",
    },
    diagram: [
      { id: "1", label: "Sequence Data", sub: "[B, T, F]", badge: "input" },
      { id: "2", label: "LSTM Recurrent Cells", sub: "Hidden State Persistence", badge: "core" },
      { id: "3", label: "Final Step Slicing", sub: "Extract last timestamp", badge: "core" },
      { id: "4", label: "Linear Classifier", sub: "Class distribution", badge: "output" },
    ],
    yamlSnippet: `component_id: "sequence/lstm-classifier@v1"
domain: "sequence"
graph:
  inputs: { in: [B, T, F] }
  outputs: { out: head }`,
  },

  // ==========================================
  // GENERATIVE & GRAPH COMPONENTS
  // ==========================================
  {
    id: "generative/vae@v1",
    name: "Variational Autoencoder",
    kind: "component",
    domain: "Generative",
    specs: "Latent Reparameterization",
    desc: "Convolutional encoder-decoder pair with KL-divergence loss scheduling and Gaussian sampling.",
    cmd: "sentinel component show generative/vae@v1",
    tags: ["generative", "vae", "latent"],
    specsDetail: {
      inputs: "[B, F]",
      loss: "Reconstruction MSE + KL Divergence",
      optimizer: "Adam (lr=0.001)",
      checkpoint: "latest",
      resume: "true",
      parameters: "latent_dim=16",
    },
    diagram: [
      { id: "1", label: "Input Matrix", sub: "[B, F]", badge: "input" },
      { id: "2", label: "Encoder Network", sub: "Projects to mu & log_var", badge: "core" },
      { id: "3", label: "Reparameterization Trick", sub: "z = mu + eps * exp(0.5 * log_var)", badge: "routing" },
      { id: "4", label: "Decoder Network", sub: "Reconstructs original features", badge: "core" },
      { id: "5", label: "Reconstruction Loss + KL", sub: "ELBO Optimization", badge: "loss" },
    ],
    yamlSnippet: `component_id: "generative/vae@v1"
domain: "generative"
graph:
  inputs: { in: [B, F] }
  outputs: { recon: decoder, mu: mu_head, log_var: var_head }`,
  },
  {
    id: "generative/gan@v1",
    name: "Generative Adversarial Network",
    kind: "component",
    domain: "Generative",
    specs: "Generator + Discriminator",
    desc: "Minimax adversarial training pair with non-saturating loss and gradient penalty stabilization.",
    cmd: "sentinel component show generative/gan@v1",
    tags: ["generative", "gan", "adversarial"],
    specsDetail: {
      inputs: "Random Noise [B, Z] -> Synthetic [B, F]",
      loss: "BCE Adversarial Loss",
      optimizer: "Adam (betas=[0.5, 0.999])",
      checkpoint: "latest",
      resume: "true",
      parameters: "d_steps=1, g_steps=1",
    },
    diagram: [
      { id: "1", label: "Gaussian Noise", sub: "[B, Z]", badge: "input" },
      { id: "2", label: "Generator G(z)", sub: "Synthetic feature synthesizer", badge: "core" },
      { id: "3", label: "Discriminator D(x)", sub: "Real vs Fake probability", badge: "core" },
      { id: "4", label: "Adversarial Minimax Loss", sub: "Zero-sum equilibrium", badge: "loss" },
    ],
    yamlSnippet: `component_id: "generative/gan@v1"
domain: "generative"
gan:
  generator: { in: [B, Z], out: [B, F] }
  discriminator: { in: [B, F], out: [B, 1] }`,
  },
  {
    id: "graph/gcn-classifier@v1",
    name: "Graph ConvNet",
    kind: "component",
    domain: "Graph",
    specs: "Spectral graph convolution",
    desc: "Edge dropout and symmetric adjacency normalization with isolated memory management.",
    cmd: "sentinel component show graph/gcn-classifier@v1",
    tags: ["graph", "gcn", "gnn"],
    specsDetail: {
      inputs: "Node Features [N, F] + Adjacency [N, N]",
      loss: "Cross Entropy",
      optimizer: "Adam",
      checkpoint: "latest",
      resume: "true",
      parameters: "Symmetric Adjacency Normalization",
    },
    diagram: [
      { id: "1", label: "Adjacency + Node Features", sub: "A_hat + X [N, F]", badge: "input" },
      { id: "2", label: "Spectral Graph Conv 1", sub: "Message Passing Neighborhoods", badge: "core" },
      { id: "3", label: "Spectral Graph Conv 2", sub: "Node Representation Aggregation", badge: "core" },
      { id: "4", label: "Node Class Logits", sub: "[N, Classes]", badge: "output" },
    ],
    yamlSnippet: `component_id: "graph/gcn-classifier@v1"
domain: "graph"
graph:
  inputs: { nodes: [N, F], adj: [N, N] }
  outputs: { out: head }`,
  },

  // ==========================================
  // TEMPLATES (Full Pipelines & Recipes)
  // ==========================================
  {
    id: "llm/lora-finetune@v1",
    name: "LoRA Fine-Tune (LLM)",
    kind: "template",
    domain: "LLM",
    specs: "PEFT LoRA · bfloat16 · Optuna ASHA Sweeps",
    desc: "Production parameter-efficient fine-tuning template for lightweight open-source language models with automated learning rate sweeps and crash-safe MLflow tracking.",
    cmd: "sentinel add llm/lora-finetune@v1",
    tags: ["llm", "lora", "peft", "optuna", "asha", "finetune"],
    specsDetail: {
      inputs: "Instruction Token Dataset (JSONL)",
      loss: "Causal Language Modeling CrossEntropy",
      optimizer: "AdamW (lr=0.0002, linear warmup)",
      checkpoint: "latest (atomic swap) / all",
      resume: "true (seamless resumption)",
      parameters: "rank=16, alpha=32, target_modules=[q_proj, v_proj]",
    },
    diagram: [
      { id: "1", label: "Prompt / Target Tokens", sub: "[B, SeqLen] Text Token Stream", badge: "input" },
      { id: "2", label: "Frozen Base LLM Weights", sub: "W_0 in bfloat16 (no grad)", badge: "core" },
      { id: "3", label: "Low-Rank LoRA Adapters", sub: "Delta W = B x A * (alpha / r)", badge: "routing" },
      { id: "4", label: "CrossEntropy Token Loss", sub: "Teacher-forced next token loss", badge: "loss" },
      { id: "5", label: "Optuna ASHA Multi-Trial", sub: "Automatic early stopping of weak runs", badge: "output" },
    ],
    yamlSnippet: `schema_version: "1.0"
component_id: "llm/lora-finetune@v1"
name: "LoRA Fine-Tune (LLM)"
domain: "llm"
parameters:
  lora_rank: { type: int, default: 16 }
  lora_alpha: { type: int, default: 32 }
  lr: { type: float, default: 0.0002 }
training:
  checkpoint: latest
  resume: true
  amp: "bfloat16"`,
  },
  {
    id: "custom/starter@v1",
    name: "Blank Custom Recipe",
    kind: "template",
    domain: "Custom",
    specs: "Standalone Python · Optuna ASHA · MLflow",
    desc: "Standard starter blueprint for custom PyTorch recipes with daemon supervision, automated hyperparameter optimization, and checkpointing.",
    cmd: "sentinel add custom/starter@v1",
    tags: ["custom", "starter", "python", "optuna", "mlflow"],
    specsDetail: {
      inputs: "Any User CSV / Folder / Stream",
      loss: "Custom Task Loss",
      optimizer: "User Configurable",
      checkpoint: "latest (atomic rename)",
      resume: "true",
      parameters: "Full Python Script Scaffolding",
    },
    diagram: [
      { id: "1", label: "User Python / PyTorch Code", sub: "Starter train.py recipe", badge: "input" },
      { id: "2", label: "Sentinel Process Supervisor", sub: "SIGTERM interception & restart", badge: "core" },
      { id: "3", label: "Telemetry & Hardware Hooks", sub: "mlruns/ logging & GPU monitor", badge: "core" },
      { id: "4", label: "Crash-Safe Checkpointer", sub: "checkpoint_latest.pt atomic swap", badge: "output" },
    ],
    yamlSnippet: `schema_version: "1.0"
component_id: "custom/starter@v1"
name: "Blank Custom Recipe"
domain: "custom"
training:
  checkpoint: latest
  resume: true`,
  },
  {
    id: "custom/command-runner@v1",
    name: "Command Adapter",
    kind: "template",
    domain: "Custom",
    specs: "Zero-Touch CLI Wrap",
    desc: "Adapter template allowing any existing bash or Python training command to run under Sentinel process supervision and live hardware telemetry.",
    cmd: "sentinel add custom/command-runner@v1",
    tags: ["custom", "adapter", "bash", "cli"],
    specsDetail: {
      inputs: "Arbitrary Bash or Python Command String",
      loss: "External Process Exit Code",
      optimizer: "N/A (Wrapped External)",
      checkpoint: "Managed by underlying script",
      resume: "Subprocess restart",
      parameters: "command: 'python train.py --epochs 50'",
    },
    diagram: [
      { id: "1", label: "CLI Command String", sub: "e.g. python train.py --epochs 50", badge: "input" },
      { id: "2", label: "Process Sandbox & Isolation", sub: "Subprocess Runner with stdout capture", badge: "core" },
      { id: "3", label: "Hardware Profiler", sub: "Real-time Apple Silicon / CUDA telemetry", badge: "core" },
      { id: "4", label: "Exit Status & Result", sub: "Clean teardown & event replay", badge: "output" },
    ],
    yamlSnippet: `schema_version: "1.0"
component_id: "custom/command-runner@v1"
name: "Command Adapter"
domain: "custom"
parameters:
  command: { type: str, default: "python train.py" }`,
  },
];

export default function CatalogPage() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"component" | "template">("component");
  const [activeDomain, setActiveDomain] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"diagram" | "specs" | "yaml">("diagram");
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Upload modal state
  const [uploadYaml, setUploadYaml] = useState<string>(`schema_version: "1.0"
component_id: "speech/custom-conformer@v1"
name: "My Custom Conformer"
domain: "speech"
author: "Aditya Kinjawadekar"
parameters:
  d_model: { type: int, default: 256 }
  num_layers: { type: int, default: 8 }
training:
  checkpoint: latest
  resume: true
  loss: { name: "ctc_loss" }
  optimizer: { name: "adamw", lr: 0.0003 }`);
  const [parsedPreview, setParsedPreview] = useState<{ id: string; name: string; domain: string; author?: string; error?: string } | null>(null);

  useEffect(() => {
    try {
      const idMatch = uploadYaml.match(/component_id:\s*["']?([^"'\n]+)["']?/);
      const nameMatch = uploadYaml.match(/name:\s*["']?([^"'\n]+)["']?/);
      const domainMatch = uploadYaml.match(/domain:\s*["']?([^"'\n]+)["']?/);
      const authorMatch = uploadYaml.match(/author:\s*["']?([^"'\n]+)["']?/);

      if (idMatch && nameMatch && domainMatch) {
        setParsedPreview({
          id: idMatch[1],
          name: nameMatch[1],
          domain: domainMatch[1],
          author: authorMatch ? authorMatch[1] : undefined,
        });
      } else {
        setParsedPreview({
          id: "",
          name: "",
          domain: "",
          error: "YAML must contain 'component_id', 'name', and 'domain'.",
        });
      }
    } catch {
      setParsedPreview({ id: "", name: "", domain: "", error: "Invalid YAML syntax" });
    }
  }, [uploadYaml]);

  // Handle ESC key to close sidebar or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
        setIsUploadOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const counts = useMemo(() => {
    return {
      component: CATALOG_ITEMS.filter((t) => t.kind === "component").length,
      template: CATALOG_ITEMS.filter((t) => t.kind === "template").length,
    };
  }, []);

  const filtered = useMemo(() => {
    return CATALOG_ITEMS.filter((t) => {
      const matchesKind = t.kind === activeTab;
      const matchesDomain =
        activeDomain === "all" || t.domain.toLowerCase() === activeDomain.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.specs.toLowerCase().includes(q) ||
        (t.author && t.author.toLowerCase().includes(q));

      return matchesKind && matchesDomain && matchesSearch;
    });
  }, [activeTab, activeDomain, searchQuery]);

  return (
    <div className="min-h-screen bg-[#070709] text-[#ececee] selection:bg-sky-500/25 selection:text-white relative font-sans">
      <div className="fixed inset-0 pointer-events-none -z-10 bg-grid opacity-50" />

      {/* Floating Header */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/[0.08] bg-[#0a0a0f]/85 px-4 sm:px-6 py-2.5 backdrop-blur-xl shadow-2xl transition-all">
          <Link href="/" className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <SentinelLogo size={22} />
            <span className="text-[14px] font-semibold tracking-tight text-white">sentinel</span>
            <span className="text-neutral-500 text-xs">/ catalog</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 text-xs font-medium text-sky-300 hover:text-white transition-all shadow-sm"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Template</span>
            </button>

            <Link
              href="/docs"
              className="text-xs text-neutral-400 hover:text-white transition-colors hidden sm:inline px-2"
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
              Click any card to inspect its interactive architecture DAG, dataflow pipelines, and checkpoint configurations in the sidebar.
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

        {/* Primary View Toggle: Components vs Templates (Strict 2-Way Division) */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <button
              onClick={() => setActiveTab("component")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "component"
                  ? "bg-white text-zinc-950 shadow-sm font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Components ({counts.component})</span>
            </button>
            <button
              onClick={() => setActiveTab("template")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "template"
                  ? "bg-white text-zinc-950 shadow-sm font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Templates ({counts.template})</span>
            </button>
          </div>

          <div className="text-xs font-mono text-zinc-400 hidden sm:block">
            {activeTab === "component" && "Neural architectures & DAG blocks (sentinel component show <id>)"}
            {activeTab === "template" && "Ready-to-train blueprints & pipelines (sentinel add <id>)"}
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
          <AnimatePresence mode="popLayout">
            {filtered.map((t) => {
              const isTemplate = t.kind === "template";
              const isSelected = selectedItem?.id === t.id;

              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                  onClick={() => {
                    setSelectedItem(t);
                    setActiveSidebarTab("diagram");
                  }}
                  className={`group cursor-pointer rounded-xl border p-5 transition-all flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? "ring-2 ring-sky-500/60 bg-[#12131c] border-sky-500/50 shadow-lg"
                      : isTemplate
                      ? "bg-[#0d0c14] border-purple-500/20 hover:border-purple-500/40 hover:bg-[#11101a] shadow-sm"
                      : "bg-[#0c0d12] border-white/10 hover:border-sky-500/30 hover:bg-[#101117]"
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
                      <span className="group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                        <span>{t.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                      </span>
                      {t.author && (
                        <span className="text-[10px] font-mono text-zinc-500 font-normal">
                          by {t.author}
                        </span>
                      )}
                    </h2>

                    <p className="mt-1 text-xs font-mono text-sky-400">{t.specs}</p>
                    <p className="mt-2 text-xs text-neutral-400 leading-relaxed">{t.desc}</p>

                    {/* Micro Visual Pipeline Preview */}
                    <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {t.diagram.slice(0, 4).map((node, i) => (
                        <React.Fragment key={node.id}>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] border border-white/[0.06] text-zinc-400 whitespace-nowrap">
                            {node.label}
                          </span>
                          {i < Math.min(3, t.diagram.length - 1) && (
                            <span className="text-[10px] text-zinc-600 font-mono">→</span>
                          )}
                        </React.Fragment>
                      ))}
                      {t.diagram.length > 4 && (
                        <span className="text-[10px] text-zinc-500 font-mono">+{t.diagram.length - 4}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                    <code className="text-[11px] font-mono text-neutral-300 truncate max-w-[280px]">
                      {t.cmd}
                    </code>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(t.cmd, t.id);
                      }}
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
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-zinc-500 text-sm font-mono">
            No {activeTab}s found matching &ldquo;{searchQuery}&rdquo; in domain &ldquo;{activeDomain}&rdquo;.
          </div>
        )}

        {/* CLI Usage Notice */}
        <div className="mt-14 rounded-xl border border-white/10 bg-[#0a0a0f] p-6 text-xs font-mono text-neutral-400 space-y-3">
          <div className="text-white font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-sky-400" />
              <span>CLI Hierarchy &amp; Resolution</span>
            </div>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="text-sky-400 hover:text-sky-300 text-xs font-mono flex items-center gap-1"
            >
              <span>Publish your own</span>
              <ArrowRight className="w-3 h-3" />
            </button>
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

      {/* ========================================================================= */}
      {/* RIGHT FLYOUT SIDEBAR (Interactive Architecture Diagram & Technical Specs) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-over panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full max-w-xl md:max-w-2xl bg-[#0b0c12] border-l border-white/10 shadow-2xl flex flex-col h-full z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-[#0d0e16]/80">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold tracking-wider ${
                        selectedItem.kind === "template"
                          ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                          : "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                      }`}
                    >
                      {selectedItem.kind.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 uppercase">
                      {selectedItem.domain}
                    </span>
                    {selectedItem.author && (
                      <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>by {selectedItem.author}</span>
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-medium text-white tracking-tight">
                    {selectedItem.name}
                  </h2>
                  <p className="text-xs font-mono text-sky-400 mt-0.5">{selectedItem.id}</p>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all border border-white/5"
                  title="Close sidebar (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar View Tabs */}
              <div className="px-6 pt-3 border-b border-white/[0.06] flex items-center gap-2 bg-[#090a0f]">
                <button
                  onClick={() => setActiveSidebarTab("diagram")}
                  className={`pb-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-all ${
                    activeSidebarTab === "diagram"
                      ? "border-sky-400 text-white"
                      : "border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Architecture Diagram</span>
                </button>
                <button
                  onClick={() => setActiveSidebarTab("specs")}
                  className={`pb-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-all ${
                    activeSidebarTab === "specs"
                      ? "border-sky-400 text-white"
                      : "border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Specs &amp; Checkpoints</span>
                </button>
                <button
                  onClick={() => setActiveSidebarTab("yaml")}
                  className={`pb-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-all ${
                    activeSidebarTab === "yaml"
                      ? "border-sky-400 text-white"
                      : "border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Raw YAML</span>
                </button>
              </div>

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* DIAGRAM VIEW */}
                {activeSidebarTab === "diagram" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                        Neural DAG Dataflow &amp; Processing Stages
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {selectedItem.diagram.length} Stages
                      </span>
                    </div>

                    {/* Flow Diagram */}
                    <div className="space-y-2.5 relative pl-4 border-l-2 border-white/10 ml-2">
                      {selectedItem.diagram.map((node, idx) => {
                        const badgeColors = {
                          input: "bg-blue-500/10 text-blue-300 border-blue-500/30",
                          core: "bg-zinc-800 text-zinc-300 border-zinc-700",
                          routing: "bg-amber-500/10 text-amber-300 border-amber-500/30",
                          loss: "bg-rose-500/10 text-rose-300 border-rose-500/30",
                          output: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
                        };

                        return (
                          <motion.div
                            key={node.id}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04, duration: 0.2 }}
                            className="relative group"
                          >
                            {/* Indicator dot */}
                            <div className="absolute -left-[23px] top-3.5 w-3 h-3 rounded-full bg-[#0b0c12] border-2 border-sky-400 group-hover:scale-125 transition-transform" />

                            <div className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-white tracking-tight">
                                  {idx + 1}. {node.label}
                                </span>
                                {node.badge && (
                                  <span
                                    className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-medium ${
                                      badgeColors[node.badge] || badgeColors.core
                                    }`}
                                  >
                                    {node.badge}
                                  </span>
                                )}
                              </div>
                              {node.sub && (
                                <p className="mt-1 text-xs font-mono text-zinc-400">{node.sub}</p>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="mt-4 p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 text-xs text-neutral-300 space-y-1.5 font-mono">
                      <div className="text-sky-300 font-semibold flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Live CLI Composition</span>
                      </div>
                      <p className="font-sans text-neutral-400 text-xs">
                        Inspect the full PyTorch layer graph and compile-time shapes locally:
                      </p>
                      <div className="pt-1 text-neutral-200">
                        $ {selectedItem.cmd}
                      </div>
                    </div>
                  </div>
                )}

                {/* SPECS VIEW */}
                {activeSidebarTab === "specs" && (
                  <div className="space-y-5">
                    <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Configuration &amp; Checkpoint Strategy
                    </div>

                    {selectedItem.specsDetail ? (
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(selectedItem.specsDetail).map(([key, val]) => (
                          <div
                            key={key}
                            className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <span className="text-xs font-mono text-zinc-400 capitalize">{key}:</span>
                            <span className="text-xs font-mono text-white text-right font-medium">
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-white/[0.06] text-xs text-zinc-400 font-mono">
                        {selectedItem.specs}
                      </div>
                    )}

                    <div className="p-4 rounded-xl border border-white/[0.08] bg-[#07080c] space-y-2">
                      <div className="text-xs font-medium text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Default Checkpoint &amp; Resume Guarantee</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        All Sentinel components enforce crash-safe atomic saves to <code className="text-zinc-200 font-mono">checkpoint_latest.pt</code> via temporary file renaming. In case of preemptions, training automatically resumes from the last completed epoch.
                      </p>
                    </div>
                  </div>
                )}

                {/* YAML VIEW */}
                {activeSidebarTab === "yaml" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-400">
                        Specification: {selectedItem.id}
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedItem.yamlSnippet, selectedItem.id + "_yaml")}
                        className="flex items-center gap-1.5 text-xs font-mono text-sky-400 hover:text-white transition-colors"
                      >
                        {copiedCmd === selectedItem.id + "_yaml" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy YAML</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl border border-white/10 bg-[#07080c] text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                      <code>{selectedItem.yamlSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Footer Quick Action */}
              <div className="p-4 sm:p-6 border-t border-white/[0.08] bg-[#0a0a0f] flex items-center justify-between gap-3">
                <div className="truncate font-mono text-xs text-zinc-400">
                  <span className="text-zinc-500 mr-2">$</span>
                  <span className="text-white">{selectedItem.cmd}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedItem.cmd, selectedItem.id + "_footer")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-zinc-950 font-medium text-xs hover:bg-neutral-200 transition-all flex-shrink-0"
                >
                  {copiedCmd === selectedItem.id + "_footer" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Command</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* UPLOAD TEMPLATE MODAL / DRAWER                                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsUploadOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Upload Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full max-w-xl md:max-w-2xl bg-[#0b0c12] border-l border-white/10 shadow-2xl flex flex-col h-full z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-[#0d0e16]/80">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30">
                      CONTRIBUTE
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">SENTINEL HUB</span>
                  </div>
                  <h2 className="text-xl font-medium text-white tracking-tight flex items-center gap-2">
                    <Upload className="w-5 h-5 text-sky-400" />
                    <span>Upload &amp; Publish Template</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Publish custom neural DAG components and end-to-end training templates to the Sentinel Hub registry.
                  </p>
                </div>

                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all border border-white/5"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Method 1: CLI Push (Primary) */}
                <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/[0.03] space-y-2">
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-sky-400" />
                    <span>Method 1: Direct CLI Push (Recommended)</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    Use the Sentinel CLI to validate and publish any component or template directly from your project terminal:
                  </p>
                  <div className="mt-2 p-3 rounded-lg bg-[#07080c] border border-white/10 flex items-center justify-between gap-2">
                    <code className="text-xs font-mono text-sky-300 truncate">
                      $ sentinel push components/my-model.yaml
                    </code>
                    <button
                      onClick={() => copyToClipboard("sentinel push components/my-model.yaml", "cli_push")}
                      className="p-1 text-zinc-400 hover:text-white"
                    >
                      {copiedCmd === "cli_push" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Method 2: Live YAML Verification & Diagram Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Template YAML Specification Preview
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">Live Validator</span>
                  </div>

                  <textarea
                    value={uploadYaml}
                    onChange={(e) => setUploadYaml(e.target.value)}
                    rows={10}
                    className="w-full p-3.5 rounded-xl border border-white/10 bg-[#07080c] font-mono text-xs text-zinc-200 outline-none focus:border-sky-500/50 transition-all resize-y"
                    placeholder="Paste your sentinel.yaml or component.yaml definition here…"
                  />

                  {/* Parsed Preview Card */}
                  {parsedPreview && !parsedPreview.error ? (
                    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Valid Sentinel Specification Detected</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                        <div>
                          <span className="text-zinc-500">ID:</span>{" "}
                          <span className="text-zinc-200">{parsedPreview.id}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Name:</span>{" "}
                          <span className="text-zinc-200">{parsedPreview.name}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Domain:</span>{" "}
                          <span className="text-zinc-200">{parsedPreview.domain}</span>
                        </div>
                        {parsedPreview.author && (
                          <div>
                            <span className="text-zinc-500">Author:</span>{" "}
                            <span className="text-zinc-200">{parsedPreview.author}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/[0.04] text-xs font-mono text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{parsedPreview?.error || "Invalid YAML"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-white/[0.08] bg-[#0a0a0f] flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-sans">
                  Review contribution guidelines in docs
                </span>
                <a
                  href="https://github.com/rimraf-adi/sentinel-hub/tree/main/modules"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-zinc-950 font-medium text-xs transition-all"
                >
                  <span>Submit PR on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
