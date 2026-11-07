"use client";

import { useState, useEffect, useCallback } from "react";
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
  Cpu,
  RefreshCw,
  Eye,
  X,
  FileCode,
  Github
} from "lucide-react";

type Module = {
  id: string;
  component_id: string;
  name: string;
  domain: string;
  path: string;
  description: string;
  tags?: string[];
};

export default function TemplatesDocPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [modules, setModules] = useState<Module[]>(registryData.modules as Module[]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedYaml, setSelectedYaml] = useState<string | null>(null);
  const [loadingYaml, setLoadingYaml] = useState(false);

  const fetchLiveModules = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/registry?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.modules && Array.isArray(data.modules)) {
          setModules(data.modules);
        }
      }
    } catch (err) {
      console.error("Failed to load modules dynamically:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveModules();
  }, [fetchLiveModules]);

  useEffect(() => {
    if (!selectedModule) {
      setSelectedYaml(null);
      return;
    }
    setLoadingYaml(true);
    fetch(`/api/raw?path=${encodeURIComponent(selectedModule.path)}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedYaml(data.content || "# No content available");
        setLoadingYaml(false);
      })
      .catch(() => {
        setSelectedYaml("# Failed to load raw YAML from git");
        setLoadingYaml(false);
      });
  }, [selectedModule]);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

        {/* Dynamic Catalog Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Full Architecture Catalog</h2>
                <button
                  onClick={fetchLiveModules}
                  className="p-1 text-zinc-400 hover:text-white"
                  title="Refresh from Git"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-sky-400" : ""}`} />
                </button>
              </div>
              <p className="text-xs text-zinc-400">
                {modules.length} production-ready templates dynamically loaded from repository
              </p>
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
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedModule(m)}
                      className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                      title="Inspect live YAML specification"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
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
              </div>
            ))}
          </div>
        </section>

        {/* Modal for Live YAML in Templates Guide */}
        {selectedModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0b0c10] border border-white/[0.1] rounded-2xl max-w-2xl w-full p-6 space-y-4 glow-card max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h3 className="font-bold text-white text-lg">{selectedModule.name}</h3>
                  <span className="text-xs font-mono text-zinc-400">{selectedModule.path}</span>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="p-1 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-xl bg-[#070709] border border-white/[0.08] p-3 max-h-72 overflow-y-auto font-mono text-xs text-zinc-300">
                {loadingYaml ? (
                  <div className="py-8 text-center text-zinc-500">Loading YAML from git repo...</div>
                ) : (
                  <pre className="whitespace-pre overflow-x-auto text-zinc-300">
                    {selectedYaml}
                  </pre>
                )}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/[0.06]">
                <a
                  href={`https://github.com/rimraf-adi/sentinel-hub/blob/main/${selectedModule.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-zinc-400 hover:text-white font-mono flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>View on GitHub ↗</span>
                </a>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-4 py-1.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
