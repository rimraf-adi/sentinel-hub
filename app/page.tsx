"use client";

import { useState, useMemo } from "react";
import registryData from "../registry.json";
import integrationsData from "../integrations.json";
import { 
  Search, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Eye, 
  Activity, 
  Cpu, 
  Zap, 
  Share2, 
  BookOpen, 
  Github, 
  X,
  Boxes,
  Compass,
  ArrowRight
} from "lucide-react";

type Module = {
  id: string;
  component_id: string;
  name: string;
  domain: string;
  path: string;
  description: string;
  tags?: string[];
  nodes?: number;
  edges?: number;
};

type Integration = {
  name: string;
  version: string;
  category: string;
  title: string;
  description: string;
  ui_tab?: string;
  file?: string;
};

export default function HubHome() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const modules = registryData.modules as Module[];
  const integrations = integrationsData.integrations as Integration[];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: modules.length,
      vision: 0,
      sequence: 0,
      tabular: 0,
      generative: 0,
      graph: 0,
      integrations: integrations.length,
    };
    modules.forEach((m) => {
      const d = m.domain.toLowerCase();
      if (counts[d] !== undefined) counts[d]++;
    });
    return counts;
  }, [modules, integrations]);

  const filteredModules = useMemo(() => {
    if (activeTab === "integrations") return [];
    return modules.filter((m) => {
      const matchesTab = activeTab === "all" || m.domain.toLowerCase() === activeTab;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.domain.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(q)));
      return matchesTab && matchesSearch;
    });
  }, [modules, activeTab, search]);

  const filteredIntegrations = useMemo(() => {
    if (activeTab !== "all" && activeTab !== "integrations") return [];
    return integrations.filter((i) => {
      const q = search.toLowerCase();
      return (
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      );
    });
  }, [integrations, activeTab, search]);

  const getDomainColor = (domain: string) => {
    switch (domain.toLowerCase()) {
      case "vision":
        return "text-sky-400 bg-sky-500/10 border-sky-500/20";
      case "sequence":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "tabular":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "generative":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "graph":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-mono text-xl font-bold">
              ☍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">sentinel hub</span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/25">
                  Registry v1.0
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">Decentralized ML Architecture &amp; Capability Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/rimraf-adi/sentinel-hub"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-xs text-zinc-300 transition-colors font-mono"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="#publish"
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Publish Module</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-mono mb-6">
          <Zap className="w-3.5 h-3.5" />
          <span>Zero-Budget Free GitHub Raw CDN · Fastly Edge Cached</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Modular Neural Blocks &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Capabilities</span> for Agents
        </h1>

        <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Instantly add declarative PyTorch architectures, explainable AI diagnostics, and gradient flow telemetry into your Sentinel workspace with zero cloud lock-in.
        </p>

        {/* Quick CLI Banner */}
        <div className="mt-8 max-w-xl mx-auto bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 flex items-center justify-between font-mono text-xs shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-x-auto text-zinc-300">
            <span className="text-sky-400">$</span>
            <span className="text-zinc-200">sentinel add --module vit-tiny</span>
          </div>
          <button
            onClick={() => copyToClipboard("sentinel add --module vit-tiny", "hero-cli")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors shrink-0"
          >
            {copiedId === "hero-cli" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId === "hero-cli" ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </section>

      {/* Main Catalog View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 pb-20">
        {/* Search & Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 border-b border-zinc-800/80 pb-6">
          {/* Domain Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Modules", count: domainCounts.all },
              { id: "vision", label: "Vision", count: domainCounts.vision },
              { id: "sequence", label: "Sequence", count: domainCounts.sequence },
              { id: "tabular", label: "Tabular", count: domainCounts.tabular },
              { id: "generative", label: "Generative", count: domainCounts.generative },
              { id: "graph", label: "Graph", count: domainCounts.graph },
              { id: "integrations", label: "Integrations", count: domainCounts.integrations },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id ? "bg-zinc-300 text-zinc-900" : "bg-zinc-800 text-zinc-400"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search architectures or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition-colors font-mono"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Modules Section */}
        {filteredModules.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-wider uppercase text-zinc-400 font-mono flex items-center gap-2">
                <Boxes className="w-4 h-4 text-sky-400" />
                <span>Declarative Neural Modules ({filteredModules.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules.map((mod) => {
                const addCommand = `sentinel add --module ${mod.id}`;
                return (
                  <div
                    key={mod.id}
                    className="group border border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/80 rounded-xl p-5 flex flex-col justify-between transition-all duration-200"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getDomainColor(mod.domain)}`}>
                          {mod.domain}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">{mod.component_id}</span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors mb-2">
                        {mod.name}
                      </h3>

                      <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                        {mod.description}
                      </p>

                      {mod.tags && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {mod.tags.map((t) => (
                            <span key={t} className="text-[10px] font-mono text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedModule(mod)}
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Spec</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(addCommand, mod.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-mono text-[11px] transition-colors"
                      >
                        {copiedId === mod.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Terminal className="w-3 h-3 text-sky-400" />}
                        <span>{copiedId === mod.id ? "Copied" : "sentinel add"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Integrations Section */}
        {filteredIntegrations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-wider uppercase text-zinc-400 font-mono flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Capability Packs &amp; Protocols ({filteredIntegrations.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map((item) => {
                const intCommand = `sentinel integrate add ${item.name}`;
                return (
                  <div
                    key={item.name}
                    className="group border border-emerald-500/20 hover:border-emerald-500/40 bg-zinc-900/40 hover:bg-zinc-900/80 rounded-xl p-5 flex flex-col justify-between transition-all duration-200"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                          {item.category}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">v{item.version}</span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                        {item.title}
                      </h3>

                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-zinc-500">tab: #{item.ui_tab}</span>

                      <button
                        onClick={() => copyToClipboard(intCommand, item.name)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] transition-colors"
                      >
                        {copiedId === item.name ? <Check className="w-3 h-3 text-emerald-400" /> : <Zap className="w-3 h-3 text-emerald-400" />}
                        <span>{copiedId === item.name ? "Copied" : "sentinel integrate"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty Search State */}
        {filteredModules.length === 0 && filteredIntegrations.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
            <Boxes className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-zinc-300 mb-1">No modules found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
              We couldn&apos;t find any components or integrations matching &quot;{search}&quot;.
            </p>
            <button
              onClick={() => { setSearch(""); setActiveTab("all"); }}
              className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-mono"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Decentralized Publishing Guide */}
        <section id="publish" className="mt-20 border border-zinc-800 bg-zinc-900/30 rounded-2xl p-6 sm:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-mono mb-3">
              <Share2 className="w-3 h-3" />
              <span>Decentralized Architecture</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
              Publish directly with a single command
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Sentinel Hub is open-access and serverless. Authors and autonomous coding agents can validate and publish neural DAGs or capability packs instantly using the CLI:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="border border-zinc-800 bg-zinc-950/80 rounded-xl p-4 font-mono text-xs">
                <div className="text-zinc-500 mb-1"># 1. Publish a custom component</div>
                <div className="text-sky-300">$ sentinel push components/my-model.yaml</div>
                <p className="text-[11px] text-zinc-500 mt-2 font-sans">
                  Validates nodes, edges, and parameter bindings, and stages to the community registry.
                </p>
              </div>

              <div className="border border-zinc-800 bg-zinc-950/80 rounded-xl p-4 font-mono text-xs">
                <div className="text-zinc-500 mb-1"># 2. Switch to your private org space</div>
                <div className="text-emerald-300">$ sentinel config set space https://github.com/my-org/sentinel-space</div>
                <p className="text-[11px] text-zinc-500 mt-2 font-sans">
                  Use your own GitHub or GitLab repository to manage private enterprise modules and policies.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Module Spec Slideover Modal */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getDomainColor(selectedModule.domain)}`}>
                  {selectedModule.domain}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedModule.name}</h3>
                <p className="text-xs text-zinc-400 font-mono">{selectedModule.component_id}</p>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
              <div>
                <div className="text-zinc-400 uppercase text-[10px] tracking-wider mb-1 font-semibold">Description</div>
                <p className="text-zinc-200 font-sans text-xs leading-relaxed">{selectedModule.description}</p>
              </div>

              <div>
                <div className="text-zinc-400 uppercase text-[10px] tracking-wider mb-1 font-semibold">Install CLI</div>
                <div className="bg-zinc-900 p-2.5 rounded-lg flex items-center justify-between text-zinc-200 border border-zinc-800">
                  <span>sentinel add --module {selectedModule.id}</span>
                  <button
                    onClick={() => copyToClipboard(`sentinel add --module ${selectedModule.id}`, `modal-${selectedModule.id}`)}
                    className="p-1 hover:text-sky-400"
                  >
                    {copiedId === `modal-${selectedModule.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <div className="text-zinc-400 uppercase text-[10px] tracking-wider mb-1 font-semibold">GitHub Raw CDN Endpoint</div>
                <a
                  href={`https://raw.githubusercontent.com/rimraf-adi/sentinel-hub/main/${selectedModule.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:underline flex items-center gap-1 text-[11px] break-all"
                >
                  <span>https://raw.githubusercontent.com/rimraf-adi/sentinel-hub/main/{selectedModule.path}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-2">
              <button
                onClick={() => setSelectedModule(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => copyToClipboard(`sentinel add --module ${selectedModule.id}`, `modal-btn-${selectedModule.id}`)}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs text-zinc-950 font-semibold transition-colors flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Copy Install Command</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <span>☍ Sentinel ML Supervisor</span>
            <span>·</span>
            <span>Agent-First Declarative Architecture</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com/rimraf-adi/sentinel" target="_blank" rel="noreferrer" className="hover:text-zinc-300">
              Sentinel Core
            </a>
            <a href="https://github.com/rimraf-adi/sentinel-hub" target="_blank" rel="noreferrer" className="hover:text-zinc-300">
              Registry Hub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
