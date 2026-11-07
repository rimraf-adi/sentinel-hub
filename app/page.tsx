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
  Eye, 
  Zap, 
  Share2, 
  Github, 
  X,
  Boxes,
  Compass,
  ArrowUpRight
} from "lucide-react";
import { Logo } from "./components/Logo";

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
  const [timeFilter, setTimeFilter] = useState<string>("24h");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
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
    <div className="flex flex-col min-h-screen bg-[#070709] text-zinc-100 selection:bg-sky-500/20 selection:text-white">
      {/* Hero Atmosphere Container */}
      <div className="relative hero-atmosphere border-b border-white/[0.06] overflow-hidden pb-12 sm:pb-20">
        {/* Subtle Mountain Layer Graphic */}
        <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
          <svg className="w-full h-full object-cover" viewBox="0 0 1440 480" fill="none" preserveAspectRatio="none">
            <path d="M0 480L180 340L380 410L620 280L840 370L1060 290L1260 360L1440 310V480H0Z" fill="#0b1322" opacity="0.6" />
            <path d="M0 480L140 370L320 440L540 330L780 410L980 340L1200 420L1440 360V480H0Z" fill="#080c14" opacity="0.8" />
            <path d="M0 480L220 410L460 460L720 380L940 440L1180 390L1440 440V480H0Z" fill="#070709" />
          </svg>
        </div>

        {/* Global Navigation */}
        <header className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">sentinel</span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.1]">
                  Hub Registry
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">Decentralized Machine Learning Architecture Plane</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/rimraf-adi/sentinel-hub"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] text-xs text-zinc-300 transition-colors font-mono"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="#publish"
              className="px-4 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs transition-colors shadow-sm"
            >
              Publish Module
            </a>
          </div>
        </header>

        {/* Hero Content */}
        <section className="relative z-10 pt-10 sm:pt-16 pb-8 px-4 sm:px-6 max-w-5xl mx-auto text-center">
          {/* Eyebrow Badge (Style of reference) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.12] bg-white/[0.04] text-zinc-300 text-xs font-medium mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Open-source infrastructure · Built for autonomous agents</span>
          </div>

          {/* Signature Headline with Editorial Serif */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Your <span className="font-editorial text-white/95">superpower</span> for machine learning and training
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-300/80 max-w-2xl mx-auto leading-relaxed font-normal">
            The native orchestration plane for autonomous coding agents &amp; deep learning teams to design declarative neural architectures, monitor live gradient flow, and diagnose model anomalies with zero cloud lock-in.
          </p>

          {/* Primary Action Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => copyToClipboard("curl -sSL https://raw.githubusercontent.com/rimraf-adi/sentinel-hub/main/install.sh | sh", "install-cta")}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-zinc-900 text-white border border-white/[0.15] hover:bg-zinc-800 font-medium text-sm transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4 text-sky-400" />
              <span>{copiedId === "install-cta" ? "Copied Install Script!" : "Install Sentinel CLI"}</span>
            </button>

            <a
              href="#registry"
              className="w-full sm:w-auto px-6 py-3 rounded-full text-zinc-300 hover:text-white font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Architecture Catalog</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400" />
            </a>
          </div>

          {/* Floating Frosted Glass Domain Pills */}
          <div className="mt-12 inline-flex items-center gap-1 sm:gap-2 p-1.5 rounded-full glass-pill max-w-full overflow-x-auto scrollbar-none text-xs font-medium text-zinc-300">
            {["Vision", "Sequence", "Tabular", "Generative", "xAI Diagnostics", "Telemetry"].map((pill) => (
              <button
                key={pill}
                onClick={() => {
                  const target = pill.toLowerCase().includes("vision") ? "vision"
                    : pill.toLowerCase().includes("seq") ? "sequence"
                    : pill.toLowerCase().includes("tab") ? "tabular"
                    : pill.toLowerCase().includes("gen") ? "generative"
                    : pill.toLowerCase().includes("xai") ? "integrations"
                    : "all";
                  setActiveTab(target);
                  const el = document.getElementById("registry");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-3.5 py-1.5 rounded-full hover:bg-white/[0.08] hover:text-white transition-all whitespace-nowrap"
              >
                {pill}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Product Dashboard */}
      <div id="registry" className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full -mt-8 sm:-mt-12 mb-20">
        <div className="bg-[#0b0c10] border border-white/[0.09] rounded-2xl glow-card overflow-hidden">
          {/* Dashboard Header Bar */}
          <div className="px-6 py-4 border-b border-white/[0.07] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-lg tracking-tight">Dashboard</span>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 border-l border-zinc-800 pl-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Agent Supervisor :2512 · daemon online</span>
              </div>
            </div>

            {/* Time Window Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/[0.08] rounded-lg text-xs font-medium">
              {[
                { id: "24h", label: "24 hours" },
                { id: "7d", label: "7 days" },
                { id: "30d", label: "30 days" },
                { id: "all", label: "All time" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeFilter(t.id)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timeFilter === t.id
                      ? "bg-white/[0.12] text-white font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Metric Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-white/[0.07] bg-white/[0.01]">
            <div className="p-5 border-r border-b lg:border-b-0 border-white/[0.07]">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Microkernel Memory</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono">18.4 MB</span>
                <span className="text-xs font-semibold text-emerald-400">↓ 98% leaner</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Native Rust vs. Python/Electron trackers</p>
            </div>

            <div className="p-5 border-r-0 lg:border-r border-b lg:border-b-0 border-white/[0.07]">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Peak Compute Profile</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono">22.76M</span>
                <span className="text-xs font-semibold text-sky-400">MACs / sample</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Compile-time validated tensor graphs</p>
            </div>

            <div className="p-5 border-r border-white/[0.07]">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Autograd Health</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-400 font-mono">100%</span>
                <span className="text-xs font-semibold text-emerald-400">Healthy</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">0 Vanishing / 0 Exploding layers</p>
            </div>

            <div className="p-5">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Active Protocols</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono">3 of 5</span>
                <span className="text-xs font-semibold text-zinc-400">Active</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">xai · gradient-flow · sweeps</p>
            </div>
          </div>

          {/* Search & Domain Filter Bar */}
          <div className="p-6 border-b border-white/[0.07] flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Domain Tabs */}
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
                      ? "bg-white text-zinc-950 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeTab === tab.id ? "bg-zinc-200 text-zinc-900" : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full sm:w-80 shrink-0">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search architectures or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition-colors font-mono"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Catalog Grid Area */}
          <div className="p-6">
            {filteredModules.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-semibold tracking-wider uppercase text-zinc-400 font-mono flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-sky-400" />
                    <span>Declarative Neural Architectures ({filteredModules.length})</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredModules.map((mod) => {
                    const addCommand = `sentinel add --module ${mod.id}`;
                    return (
                      <div
                        key={mod.id}
                        className="group border border-white/[0.07] hover:border-white/[0.18] bg-white/[0.02] hover:bg-white/[0.04] rounded-xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getDomainColor(mod.domain)}`}>
                              {mod.domain}
                            </span>
                            <span className="text-[11px] font-mono text-zinc-500">{mod.component_id}</span>
                          </div>

                          <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors mb-2">
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

                        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedModule(mod)}
                            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect Spec</span>
                          </button>

                          <button
                            onClick={() => copyToClipboard(addCommand, mod.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-zinc-200 font-mono text-[11px] transition-colors"
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

            {filteredIntegrations.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-semibold tracking-wider uppercase text-zinc-400 font-mono flex items-center gap-2">
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
                        className="group border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05] rounded-xl p-5 flex flex-col justify-between transition-all duration-200"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                              {item.category}
                            </span>
                            <span className="text-[11px] font-mono text-zinc-500">v{item.version}</span>
                          </div>

                          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                            {item.title}
                          </h3>

                          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono text-zinc-500">ui: #{item.ui_tab}</span>

                          <button
                            onClick={() => copyToClipboard(intCommand, item.name)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] transition-colors"
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
          </div>
        </div>

        {/* Decentralized Publishing Section */}
        <section id="publish" className="mt-16 bg-[#0b0c10] border border-white/[0.08] rounded-2xl p-6 sm:p-10 glow-card">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-mono mb-4">
              <Share2 className="w-3 h-3" />
              <span>Decentralized Architecture · Single Command</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
              Publish directly to the community registry
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
              Sentinel Hub operates on an open-access protocol with zero cloud server costs. Authors and autonomous coding agents can publish new declarative modules or capability packs in one command:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-white/[0.08] bg-black/40 rounded-xl p-5 font-mono text-xs">
                <div className="text-zinc-500 mb-2"># 1. Publish a custom component</div>
                <div className="text-sky-300 font-bold">$ sentinel push components/my-model.yaml</div>
                <p className="text-[11px] text-zinc-400 mt-2 font-sans leading-relaxed">
                  Validates nodes, edges, and parameter bindings, and stages to the community registry.
                </p>
              </div>

              <div className="border border-white/[0.08] bg-black/40 rounded-xl p-5 font-mono text-xs">
                <div className="text-zinc-500 mb-2"># 2. Switch to your private org space</div>
                <div className="text-emerald-300 font-bold">$ sentinel config set space https://github.com/my-org/sentinel-space</div>
                <p className="text-[11px] text-zinc-400 mt-2 font-sans leading-relaxed">
                  Use your own GitHub or GitLab repository to manage private enterprise modules and policies.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Module Spec Slideover Modal */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#0b0c10] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getDomainColor(selectedModule.domain)}`}>
                  {selectedModule.domain}
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5">{selectedModule.name}</h3>
                <p className="text-xs text-zinc-400 font-mono">{selectedModule.component_id}</p>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 font-mono text-xs">
              <div>
                <div className="text-zinc-400 uppercase text-[10px] tracking-wider mb-1.5 font-semibold">Description</div>
                <p className="text-zinc-200 font-sans text-xs leading-relaxed">{selectedModule.description}</p>
              </div>

              <div>
                <div className="text-zinc-400 uppercase text-[10px] tracking-wider mb-1.5 font-semibold">Install Command</div>
                <div className="bg-black/50 p-3 rounded-xl flex items-center justify-between text-zinc-200 border border-white/[0.08]">
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
                <div className="text-zinc-400 uppercase text-[10px] tracking-wider mb-1.5 font-semibold">GitHub Raw CDN Endpoint</div>
                <a
                  href={`https://raw.githubusercontent.com/rimraf-adi/sentinel-hub/main/${selectedModule.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:underline flex items-center gap-1.5 text-xs break-all"
                >
                  <span>https://raw.githubusercontent.com/rimraf-adi/sentinel-hub/main/{selectedModule.path}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            <div className="p-4 border-t border-white/[0.08] bg-black/20 flex justify-end gap-3">
              <button
                onClick={() => setSelectedModule(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs text-zinc-300 font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => copyToClipboard(`sentinel add --module ${selectedModule.id}`, `modal-btn-${selectedModule.id}`)}
                className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-xs text-zinc-950 font-semibold transition-colors flex items-center gap-2"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Copy Install Command</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#070709] py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2.5">
            <Logo size={20} />
            <span className="font-semibold text-zinc-400">Sentinel Hub</span>
            <span>·</span>
            <span>Agent-First Dual-Engine ML Control Plane</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com/rimraf-adi/sentinel" target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition-colors">
              Sentinel Core
            </a>
            <a href="https://github.com/rimraf-adi/sentinel-hub" target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition-colors">
              Sentinel Hub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
