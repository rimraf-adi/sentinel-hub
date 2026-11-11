"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

/**
 * Sentinel high-craft vector mark.
 * Neural tensor squircle glyph with cyan to emerald precision gradient.
 */
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
        <linearGradient id="sentinel-nav-grad" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <filter id="sentinel-nav-glow" x="-20%" y="-20%" width="140%" height="140%">
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

      <g filter="url(#sentinel-nav-glow)">
        <path
          d="M 23.5 11.5 H 15.5 L 10.5 16.5"
          stroke="url(#sentinel-nav-grad)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 12 15.5 L 24 20.5"
          stroke="url(#sentinel-nav-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M 25.5 19.5 L 20.5 24.5 H 12.5"
          stroke="url(#sentinel-nav-grad)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="23.5" cy="11.5" r="2.4" fill="#090a0f" stroke="url(#sentinel-nav-grad)" strokeWidth="1.8" />
        <circle cx="23.5" cy="11.5" r="1.1" fill="#38bdf8" />
        <circle cx="12.5" cy="24.5" r="2.4" fill="#090a0f" stroke="url(#sentinel-nav-grad)" strokeWidth="1.8" />
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
const CURL_INSTALL_CMD = "curl -fsSL https://raw.githubusercontent.com/rimraf-adi/sentinel/main/install.sh | bash";
const PS_INSTALL_CMD = "irm https://raw.githubusercontent.com/rimraf-adi/sentinel/main/install.ps1 | iex";
const CARGO_INSTALL_CMD = "cargo install --git https://github.com/rimraf-adi/sentinel.git sentinel-cli";

export default function Home() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [installOs, setInstallOs] = useState<"unix" | "windows">("unix");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const activeInstallCmd = installOs === "windows" ? PS_INSTALL_CMD : CURL_INSTALL_CMD;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const faqs = [
    {
      q: "Do existing PyTorch models need to be modified?",
      a: "No. Sentinel executes plain PyTorch code. Training scripts require no custom base classes, framework-specific wrappers, or proprietary abstractions.",
    },
    {
      q: "How does GPU allocation operate?",
      a: "The Sentinel daemon interfaces directly with hardware through NVML. When a job runs, Sentinel assigns idle devices via CUDA_VISIBLE_DEVICES, preventing multi-process memory conflicts.",
    },
    {
      q: "What storage format is used for experiment tracking?",
      a: "All metrics, parameters, tags, and artifacts are persisted in standard MLflow filesystem format under mlruns/. Directories can be visualized in Sentinel or inspected with the standard mlflow CLI.",
    },
    {
      q: "How can models be exported without Sentinel?",
      a: "Run `sentinel export script --component <id> --output train.py`. Sentinel generates a clean, standalone Python script with standard PyTorch nn.Module classes and training loops.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-[#ececee] selection:bg-sky-500/25 selection:text-white relative font-sans">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-grid opacity-50" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 pointer-events-none -z-10 h-[500px] w-[900px] rounded-full bg-gradient-to-b from-sky-500/10 via-emerald-500/5 to-transparent blur-[160px]" />

      {/* Floating Glass Navbar */}
      <header className="sticky top-4 z-50 px-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/[0.08] bg-[#0a0a0f]/85 px-4 sm:px-6 py-2.5 backdrop-blur-xl shadow-2xl transition-all">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <SentinelLogo size={24} />
            <span className="text-[14px] font-semibold tracking-tight text-white flex items-center gap-1.5">
              sentinel
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-neutral-400 font-mono border border-white/[0.06]">
                v1.2
              </span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-[13px] text-neutral-400">
            <Link href="/catalog" className="hover:text-white transition-colors">
              Catalog
            </Link>
            <Link href="/docs" className="hover:text-white transition-colors">
              Docs
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <Link
              href="/docs#quickstart"
              className="rounded-full bg-white px-3.5 py-1.5 text-[12px] font-medium text-black transition-all hover:bg-neutral-200 active:scale-95 shadow-sm"
            >
              Install
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-14 md:pt-28 md:pb-20 overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 text-center">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl sm:text-6xl font-normal tracking-tight text-white max-w-3xl mx-auto leading-[1.08]"
          >
            Lightweight ML orchestration &amp; neural observability.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="mt-5 text-base sm:text-lg text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed"
          >
            A single 15 MB Rust binary for process supervision, dynamic GPU allocation, and live telemetry.
            Training code stays plain PyTorch with zero framework wrappers.
          </motion.p>

          {/* Clean Install Bar */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
            className="mt-8 mx-auto max-w-xl"
          >
            <div className="mb-2.5 flex items-center justify-center gap-1.5 text-[11px] font-mono">
              <button
                onClick={() => setInstallOs("unix")}
                className={`rounded-full px-3 py-1 transition-all border ${
                  installOs === "unix"
                    ? "border-sky-400/40 bg-sky-500/10 text-sky-300"
                    : "border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white"
                }`}
              >
                macOS / Linux
              </button>
              <button
                onClick={() => setInstallOs("windows")}
                className={`rounded-full px-3 py-1 transition-all border ${
                  installOs === "windows"
                    ? "border-sky-400/40 bg-sky-500/10 text-sky-300"
                    : "border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white"
                }`}
              >
                Windows (PowerShell)
              </button>
            </div>
            <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-[#0d0d12]/95 px-4 py-2.5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3 overflow-x-auto text-xs sm:text-sm font-mono text-neutral-200">
                <span className="text-sky-400 font-bold">{installOs === "windows" ? "PS>" : "$"}</span>
                <span className="whitespace-nowrap">{activeInstallCmd}</span>
              </div>
              <button
                onClick={() => copyToClipboard(activeInstallCmd, "install-cmd")}
                className="ml-3 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-300 hover:border-white/20 hover:text-white transition-all flex-shrink-0"
              >
                {copiedCmd === "install-cmd" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-mono text-neutral-500">
              <span>Or via Cargo:</span>
              <button
                onClick={() => copyToClipboard(CARGO_INSTALL_CMD, "cargo-copy")}
                className="hover:text-neutral-300 transition-colors underline decoration-white/20"
              >
                {copiedCmd === "cargo-copy" ? "Copied cargo command!" : "cargo install sentinel-cli"}
              </button>
              <span className="text-neutral-700">·</span>
              <Link href="/docs#windows-gpu" className="hover:text-sky-300 transition-colors underline decoration-white/20">
                Windows GPU &amp; Tailscale guide
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Hero Aesthetic Screenshot Showcase */}
        <motion.div
          id="overview"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          className="relative mx-auto mt-14 max-w-5xl px-4 sm:px-6"
        >
          <div className="relative rounded-2xl border border-white/10 bg-[#090a0f] shadow-2xl ring-1 ring-white/5 overflow-hidden">
            {/* Minimalist macOS Window Chrome */}
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0c0d14] px-4 py-3">
              <div className="flex items-center gap-2 w-14">
                <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
              </div>

              {/* Clean URL Pill */}
              <div className="flex items-center gap-2 rounded-md bg-black/40 px-3 py-1 text-xs font-mono text-neutral-400 border border-white/[0.06]">
                <span className="text-neutral-500">http://</span>
                <span className="text-white">localhost:2512</span>
                <span className="text-neutral-500">/#overview</span>
              </div>

              <div className="w-14" />
            </div>

            {/* Aesthetic Screenshot */}
            <div className="relative bg-[#07070a]">
              <img
                src="/screenshots/overview.png"
                alt="Sentinel Web Console Overview Dashboard"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Measured Footprint Strip */}
      <section id="benchmarks" className="relative border-y border-white/[0.06] bg-[#09090e]/60 py-12 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="border-l border-white/10 pl-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-light text-white tracking-tight">15 MB</div>
              <div className="text-xs font-mono text-sky-400 uppercase tracking-wider">Idle RAM Footprint</div>
              <p className="text-xs text-neutral-400">Measured on Apple M1 &amp; Linux release builds.</p>
            </div>
            <div className="border-l border-white/10 pl-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-light text-white tracking-tight">0.16%</div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">CPU Overhead</div>
              <p className="text-xs text-neutral-400">Sub-millisecond native asynchronous control plane.</p>
            </div>
            <div className="border-l border-white/10 pl-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-light text-white tracking-tight">72 Blocks</div>
              <div className="text-xs font-mono text-teal-400 uppercase tracking-wider">Compile-Time Math</div>
              <p className="text-xs text-neutral-400">Input tensor shapes inferred from wiring.</p>
            </div>
            <div className="border-l border-white/10 pl-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-light text-white tracking-tight">0% Lock-in</div>
              <div className="text-xs font-mono text-purple-400 uppercase tracking-wider">Pure PyTorch</div>
              <p className="text-xs text-neutral-400">Exports to standalone train.py with no Sentinel imports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Architecture Specification Table (From README.md) */}
      <section id="architecture" className="relative py-20 bg-[#07070a]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
              ARCHITECTURE SPECIFICATION
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-normal tracking-tight text-white">
              Decoupled Control &amp; Execution Planes
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              The daemon assigns GPUs through <code className="text-neutral-300">CUDA_VISIBLE_DEVICES</code> and falls back to CPU when none are available. Runs are written to <code className="text-neutral-300">mlruns/</code>.
            </p>
          </div>

          {/* Clean Engineering Table */}
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0c0d12]">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-white/10 bg-[#101117] text-neutral-400 font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-6 w-36">Plane</th>
                  <th className="py-3.5 px-6 w-32">Language</th>
                  <th className="py-3.5 px-6">Responsibilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-neutral-300">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    Control
                  </td>
                  <td className="py-4 px-6 font-mono text-sky-400">Rust</td>
                  <td className="py-4 px-6 text-neutral-300 leading-relaxed">
                    Process supervision, GPU allocation (NVML), telemetry streaming, component resolution, web dashboard, and REST / WebSocket API.
                  </td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Execution
                  </td>
                  <td className="py-4 px-6 font-mono text-emerald-400">Python</td>
                  <td className="py-4 px-6 text-neutral-300 leading-relaxed">
                    Training loops and sweeps (PyTorch, Hugging Face, Optuna), launched with <code className="text-neutral-200 font-mono">uv run</code>, logging through <code className="text-neutral-200 font-mono">sentinel-sdk</code>.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footprint Table (From README.md) */}
          <div className="mt-8 rounded-xl border border-white/10 bg-[#0c0d12] overflow-hidden">
            <div className="px-6 py-3 border-b border-white/10 bg-[#101117] flex items-center justify-between text-xs">
              <span className="font-mono text-neutral-300 font-medium">daemon footprint benchmark (tests/bench_footprint.py)</span>
              <span className="text-[11px] font-mono text-neutral-500">Binary size: 7 MB (dashboard embedded)</span>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-neutral-400 font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-6">Scenario</th>
                  <th className="py-2.5 px-6">RSS Memory</th>
                  <th className="py-2.5 px-6">CPU (one core)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-mono text-xs text-neutral-300">
                <tr>
                  <td className="py-2.5 px-6 font-sans text-neutral-400">Idle</td>
                  <td className="py-2.5 px-6 text-sky-400">15 MB</td>
                  <td className="py-2.5 px-6 text-neutral-400">0.16%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-6 font-sans text-neutral-400">Dashboard open</td>
                  <td className="py-2.5 px-6 text-sky-400">15 MB</td>
                  <td className="py-2.5 px-6 text-neutral-400">0.74%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-6 font-sans text-neutral-400">Watching one running job</td>
                  <td className="py-2.5 px-6 text-teal-400">18 MB</td>
                  <td className="py-2.5 px-6 text-neutral-400">1.50%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-6 font-sans text-neutral-400">~100 API requests/s</td>
                  <td className="py-2.5 px-6 text-emerald-400">16 MB</td>
                  <td className="py-2.5 px-6 text-neutral-400">2.70%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Core Capabilities */}
      <section id="capabilities" className="relative py-20 border-t border-white/[0.06] bg-[#07070a]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-xl mb-12">
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">SYSTEM CAPABILITIES</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-normal tracking-tight text-white">
              Deterministic, Fast, and Validated
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl border border-white/10 bg-[#0d0e14]/70 p-5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <span className="text-xs font-mono text-sky-400">01 / SHAPE ENGINE</span>
                <h3 className="mt-2.5 text-base font-medium text-white">Compile-Time Math</h3>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                  Shape, bounds, and loss/task errors are caught up front and name the offending block before PyTorch starts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-neutral-500">
                sentinel component show &lt;id&gt;
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0d0e14]/70 p-5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <span className="text-xs font-mono text-emerald-400">02 / HARDWARE POOL</span>
                <h3 className="mt-2.5 text-base font-medium text-white">Dynamic GPU Scheduling</h3>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                  The daemon provisions idle devices using CUDA_VISIBLE_DEVICES via NVML and provides deterministic SIGTERM process tree draining.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-neutral-500">
                Non-colliding CUDA isolation
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0d0e14]/70 p-5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <span className="text-xs font-mono text-teal-400">03 / EXTENSIBILITY</span>
                <h3 className="mt-2.5 text-base font-medium text-white">Three-Tier Template Hierarchy</h3>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                  Components resolve predictably across three tiers: Built-in (embedded), User (~/.sentinel/templates), and Project (./components).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-neutral-500">
                sentinel component list
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0d0e14]/70 p-5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <span className="text-xs font-mono text-purple-400">04 / ZERO LOCK-IN</span>
                <h3 className="mt-2.5 text-base font-medium text-white">Standalone PyTorch Export</h3>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                  Export any model graph directly into clean, self-contained train.py code, TorchScript, or ONNX with zero Sentinel runtime dependencies.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-neutral-500">
                sentinel export script
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0d0e14]/70 p-5 flex flex-col justify-between hover:border-white/20 transition-all md:col-span-2">
              <div>
                <span className="text-xs font-mono text-amber-400">05 / TELEMETRY RESILIENCE</span>
                <h3 className="mt-2.5 text-base font-medium text-white">Non-Blocking Telemetry Plane</h3>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                  SDK calls never throw exceptions into the training loop. Disconnected supervisors or disk bottlenecks are safely buffered in memory.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>packages/sentinel-sdk</span>
                <span className="text-emerald-400">Uninterrupted training loops</span>
              </div>
            </div>
          </div>

          {/* Clean link to the dedicated catalog */}
          <div className="mt-8 p-4 rounded-xl border border-white/10 bg-[#0c0d12] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-neutral-400 font-sans">
              Looking for pre-configured models? Browse all 13 verified architectures including ViT, ResNet, U-Net, VAE, GAN, and GCN.
            </span>
            <Link
              href="/catalog"
              className="text-white hover:text-sky-300 transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Explore Model Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Comparison Table */}
      <section className="relative py-20 border-t border-white/[0.06] bg-[#07070a]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-xl mb-10">
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">ARCHITECTURAL CONTRAST</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-normal tracking-tight text-white">
              Traditional Python Tooling vs. Sentinel
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0c0d12]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#101117] text-neutral-400 font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-6 w-1/2">Traditional Python Setup</th>
                  <th className="py-3 px-6 w-1/2 text-white border-l border-white/10">With Sentinel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                <tr>
                  <td className="py-3.5 px-6 text-neutral-400">
                    Handwritten argparse, manual GPU indexing scripts, and brittle bash files.
                  </td>
                  <td className="py-3.5 px-6 text-white font-medium border-l border-white/10">
                    Declarative YAML components with automated CLI, API, and UI generation.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 text-neutral-400">
                    Supervisor crashes; orphan worker processes hold GPU VRAM hostage.
                  </td>
                  <td className="py-3.5 px-6 text-white font-medium border-l border-white/10">
                    Native Rust supervisor with deterministic SIGTERM process tree draining.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 text-neutral-400">
                    Heavy memory footprint (500 MB to 2 GB for Python/Electron web servers).
                  </td>
                  <td className="py-3.5 px-6 text-white font-medium border-l border-white/10">
                    Ultra-lightweight native Rust binary consuming ~15 MB RAM at idle.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 text-neutral-400">
                    Framework lock-in (mandatory base classes, wrapper loggers, custom loops).
                  </td>
                  <td className="py-3.5 px-6 text-white font-medium border-l border-white/10">
                    Zero lock-in: export standalone train.py or TorchScript at any time.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. Quick Start Workflow (From README.md) */}
      <section className="relative py-20 border-t border-white/[0.06] bg-[#08080c]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="max-w-xl">
              <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">CLI WORKFLOW</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-normal tracking-tight text-white">
                Quick Start
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <button
                onClick={() => setInstallOs("unix")}
                className={`rounded-full px-3 py-1 transition-all border ${
                  installOs === "unix"
                    ? "border-sky-400/40 bg-sky-500/10 text-sky-300"
                    : "border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white"
                }`}
              >
                macOS / Linux
              </button>
              <button
                onClick={() => setInstallOs("windows")}
                className={`rounded-full px-3 py-1 transition-all border ${
                  installOs === "windows"
                    ? "border-sky-400/40 bg-sky-500/10 text-sky-300"
                    : "border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white"
                }`}
              >
                Windows
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0c0d12] p-5 font-mono text-xs space-y-4">
            <div>
              <div className="text-neutral-500 mb-1">
                # 1. Install Sentinel CLI and daemon ({installOs === "windows" ? "PowerShell" : "Bash"})
              </div>
              <div className="p-3 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between text-neutral-200">
                <span className="truncate">{activeInstallCmd}</span>
                <button
                  onClick={() => copyToClipboard(activeInstallCmd, "qs-1")}
                  className="ml-2 text-neutral-400 hover:text-white"
                >
                  {copiedCmd === "qs-1" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <div className="text-neutral-500 mb-1"># 2. Launch the control plane and dashboard (http://localhost:2512)</div>
              <div className="p-3 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between text-neutral-200">
                <span>sentinel dev</span>
                <button
                  onClick={() => copyToClipboard("sentinel dev", "qs-2")}
                  className="ml-2 text-neutral-400 hover:text-white"
                >
                  {copiedCmd === "qs-2" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <div className="text-neutral-500 mb-1"># 3. Check environment setup &amp; available templates</div>
              <div className="p-3 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between text-neutral-200">
                <span>sentinel doctor && sentinel component list</span>
                <button
                  onClick={() => copyToClipboard("sentinel doctor && sentinel component list", "qs-3")}
                  className="ml-2 text-neutral-400 hover:text-white"
                >
                  {copiedCmd === "qs-3" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <div className="text-neutral-500 mb-1"># 4. Export standalone PyTorch code without Sentinel dependencies</div>
              <div className="p-3 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between text-neutral-200">
                <span>sentinel export script --component vision/vit-tiny@v1 --output train.py</span>
                <button
                  onClick={() => copyToClipboard("sentinel export script --component vision/vit-tiny@v1 --output train.py", "qs-4")}
                  className="ml-2 text-neutral-400 hover:text-white"
                >
                  {copiedCmd === "qs-4" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="relative py-20 border-t border-white/[0.06] bg-[#07070a]">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">QUESTIONS &amp; ANSWERS</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-normal tracking-tight text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-[#0d0e14]/70 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-white hover:text-sky-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-neutral-400 transition-transform ${
                        isOpen ? "rotate-180 text-sky-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-neutral-400 leading-relaxed border-t border-white/[0.04]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Final Call to Action & Footer */}
      <section id="quickstart" className="relative py-20 border-t border-white/10 bg-[#060608] overflow-hidden text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-white">
            Get Started with Sentinel
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 font-light max-w-lg mx-auto">
            Open source. Dual-licensed under Apache 2.0 or MIT.
          </p>

          <div className="mt-7 flex justify-center">
            <div className="flex items-center gap-3 rounded-full border border-white/15 bg-neutral-900/90 px-4 py-2 shadow-xl">
              <span className="font-mono text-xs text-sky-400 font-bold">{installOs === "windows" ? "PS>" : "$"}</span>
              <code className="font-mono text-xs text-white">{activeInstallCmd}</code>
              <button
                onClick={() => copyToClipboard(activeInstallCmd, "final-install")}
                className="ml-2 text-neutral-400 hover:text-white"
              >
                {copiedCmd === "final-install" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/[0.06] pt-6 text-xs text-neutral-500">
          <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <SentinelLogo size={18} />
              <span className="text-neutral-300 font-medium">Sentinel</span>
              <span className="text-neutral-600">Dual-licensed under Apache 2.0 or MIT.</span>
            </Link>
            <div className="flex items-center gap-5 text-neutral-400">
              <Link href="/catalog" className="hover:text-white transition-colors">Catalog</Link>
              <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
              <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}
