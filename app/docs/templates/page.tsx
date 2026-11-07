"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import registryData from "../../../registry.json";
import { 
  Terminal, 
  Copy, 
  Check, 
  Layers, 
  Download, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink,
  Code2,
  Box,
  Cpu
} from "lucide-react";

export default function TemplatesDocPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const modules = registryData.modules;

  const filteredModules = modules.filter(
    (m) => activeCategory === "all" || m.domain.toLowerCase() === activeCategory
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#070709] text-zinc-100">
      <Navbar activePage="templates" />

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Installation & Architectural Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Installing & Composing Templates
          </h1>
          <p className="text-base text-zinc-300 leading-relaxed max-w-3xl">
            Sentinel templates are declarative neural graphs and training configurations. They allow you to start from tested architectures (ViT, U-Net, ResNet, VAE, GAN, residual MLPs) and customize hyperparameters without writing boilerplate.
          </p>
        </div>

        {/* Three-Tier Discovery Hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.02]">
            <div className="text-xs font-mono uppercase text-sky-400 tracking-wider mb-1">Tier 1 · Shipped</div>
            <h3 className="font-bold text-white text-base mb-2">Built-in</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Embedded directly in the Sentinel binary. Immutable, offline, and ready to train out of the box.
            </p>
            <div className="text-[11px] font-mono text-zinc-500">Location: Embedded in binary</div>
          </div>

          <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.02]">
            <div className="text-xs font-mono uppercase text-purple-400 tracking-wider mb-1">Tier 2 · Shared</div>
            <h3 className="font-bold text-white text-base mb-2">User Templates</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Stored on your local machine and available across all Sentinel projects and experiments.
            </p>
            <div className="text-[11px] font-mono text-zinc-500">Location: ~/.sentinel/templates/</div>
          </div>

          <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.02]">
            <div className="text-xs font-mono uppercase text-emerald-400 tracking-wider mb-1">Tier 3 · Project</div>
            <h3 className="font-bold text-white text-base mb-2">Project Components</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Committed directly into your repo in ./components/. Takes precedence over user templates.
            </p>
            <div className="text-[11px] font-mono text-zinc-500">Location: ./components/</div>
          </div>
        </div>

        {/* Installation CLI commands */}
        <section className="space-y-4 mb-16">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-sky-400" />
            <span>CLI Commands for Templates</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0b0c10] border border-white/[0.08] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-zinc-400 font-sans font-medium">
                <span>Install from Registry / URL</span>
                <button
                  onClick={() => copy("sentinel template add vision/vit-tiny@v1", "t-add")}
                  className="p-1 hover:bg-white/[0.08] rounded text-zinc-400 hover:text-white"
                >
                  {copiedId === "t-add" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="text-sky-300">sentinel template add vision/vit-tiny@v1</pre>
              <p className="text-[11px] font-sans text-zinc-500">
                Downloads and registers the template into your project's components.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0b0c10] border border-white/[0.08] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-zinc-400 font-sans font-medium">
                <span>Freeze Run to Component</span>
                <button
                  onClick={() => copy("sentinel component save-run <RUN_ID> --name my-model", "t-save")}
                  className="p-1 hover:bg-white/[0.08] rounded text-zinc-400 hover:text-white"
                >
                  {copiedId === "t-save" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="text-sky-300">sentinel component save-run &lt;ID&gt; --name &lt;NAME&gt;</pre>
              <p className="text-[11px] font-sans text-zinc-500">
                Saves the exact configuration, weights, and graph of a successful run as a component.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0b0c10] border border-white/[0.08] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-zinc-400 font-sans font-medium">
                <span>List Available Components</span>
                <button
                  onClick={() => copy("sentinel component list", "t-list")}
                  className="p-1 hover:bg-white/[0.08] rounded text-zinc-400 hover:text-white"
                >
                  {copiedId === "t-list" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="text-sky-300">sentinel component list</pre>
              <p className="text-[11px] font-sans text-zinc-500">
                Displays all available built-in, user, and project-level templates.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0b0c10] border border-white/[0.08] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-zinc-400 font-sans font-medium">
                <span>Export Standalone Script</span>
                <button
                  onClick={() => copy("sentinel export script --component vision/vit-tiny@v1 --output train.py", "t-export")}
                  className="p-1 hover:bg-white/[0.08] rounded text-zinc-400 hover:text-white"
                >
                  {copiedId === "t-export" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="text-sky-300">sentinel export script --component &lt;id&gt; --output train.py</pre>
              <p className="text-[11px] font-sans text-zinc-500">
                Generates a zero-dependency PyTorch script ready to run anywhere.
              </p>
            </div>
          </div>
        </section>

        {/* Catalog of 14 Templates */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Full Architecture Catalog</h2>
              <p className="text-xs text-zinc-400">14 production-ready templates verified against PyTorch</p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.08] rounded-lg text-xs font-medium">
              {["all", "vision", "sequence", "tabular", "generative", "graph", "experimental"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-md transition-colors capitalize ${
                    activeCategory === cat ? "bg-white text-zinc-950 font-semibold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-xl border border-white/[0.08] bg-[#0b0c10] hover:border-white/[0.16] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-white/[0.05] text-sky-400 border border-white/[0.08]">
                      {m.domain}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">{m.component_id}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5">{m.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">{m.description}</p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <code className="text-[11px] font-mono text-zinc-300">
                    sentinel add {m.id}
                  </code>
                  <button
                    onClick={() => copy(`sentinel add ${m.id}`, m.id)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                    title="Copy install command"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
