"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import registryData from "../registry.json";
import integrationsData from "../integrations.json";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
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
  ArrowRight,
  Layers,
  Activity,
  ShieldCheck,
  Cpu,
  RefreshCw,
  GitBranch,
  FileCode,
  Download,
  CheckCircle2
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

type Integration = {
  name: string;
  version: string;
  category: string;
  title: string;
  description: string;
  command?: string;
  ui_tab?: string;
  file?: string;
};

type GitCommit = {
  sha: string;
  message: string;
  date: string;
};

export default function HubHome() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedModuleYaml, setSelectedModuleYaml] = useState<string | null>(null);
  const [loadingYaml, setLoadingYaml] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamic modules state initialized from bundled JSON
  const [modules, setModules] = useState<Module[]>(registryData.modules as Module[]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSource, setSyncSource] = useState<"github" | "local_fallback">("github");
  const [latestCommit, setLatestCommit] = useState<GitCommit | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  const integrations = integrationsData.integrations as Integration[];

  // Dynamic fetch function from git repo
  const fetchLiveRegistry = useCallback(async (isManual = false) => {
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/registry?refresh=${isManual ? "true" : "false"}&_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.modules && Array.isArray(data.modules)) {
          setModules(data.modules);
        }
        if (data.source) {
          setSyncSource(data.source);
        }
        if (data.latestCommit) {
          setLatestCommit(data.latestCommit);
        }
        setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error("Failed to sync live templates from git:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Sync on initial load
  useEffect(() => {
    fetchLiveRegistry();
  }, [fetchLiveRegistry]);

  // When a module is selected, fetch its live raw YAML from git
  useEffect(() => {
    if (!selectedModule) {
      setSelectedModuleYaml(null);
      return;
    }

    let isMounted = true;
    setLoadingYaml(true);
    fetch(`/api/raw?path=${encodeURIComponent(selectedModule.path)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setSelectedModuleYaml(data.content || "# No content available");
          setLoadingYaml(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setSelectedModuleYaml("# Failed to load live template YAML from git repository");
          setLoadingYaml(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedModule]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredModules = useMemo(() => {
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

  const getDomainBadge = (domain: string) => {
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
    <div className="flex flex-col min-h-screen bg-[#070709] text-zinc-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative hero-atmosphere border-b border-white/[0.06] overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-6">
        <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
          <svg className="w-full h-full object-cover" viewBox="0 0 1440 480" fill="none" preserveAspectRatio="none">
            <path d="M0 480L180 340L380 410L620 280L840 370L1060 290L1260 360L1440 310V480H0Z" fill="#0b1322" opacity="0.6" />
            <path d="M0 480L140 370L320 440L540 330L780 410L980 340L1200 420L1440 360V480H0Z" fill="#080c14" opacity="0.8" />
            <path d="M0 480L220 410L460 460L720 380L940 440L1180 390L1440 440V480H0Z" fill="#070709" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] text-zinc-300 text-xs font-medium backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Open source · Built for coding agents and ML teams</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Start from a template. <br className="hidden sm:inline" />
            Build with blocks. <span className="font-editorial text-sky-200">See every run.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300/85 max-w-2xl mx-auto leading-relaxed font-normal">
            Sentinel is a lightweight control plane for ML training. Define models as modular graphs, run them on your own hardware, and monitor training from one dashboard. No cloud account required.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#install"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4 text-zinc-900" />
              <span>Install Sentinel</span>
            </a>

            <a
              href="#architectures"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/[0.15] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Browse architectures</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </a>
          </div>

          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-black/60 border border-white/[0.1] font-mono text-xs text-zinc-300 shadow-inner">
              <span className="truncate text-left text-zinc-200">
                cargo build --release -p sentinel-cli &amp;&amp; ./target/release/sentinel dev
              </span>
              <button
                onClick={() => copyToClipboard("cargo build --release -p sentinel-cli && ./target/release/sentinel dev", "install-hero")}
                className="p-1.5 rounded-lg hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors shrink-0"
                title="Copy install command"
              >
                {copiedId === "install-hero" ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Strip */}
      <section className="border-b border-white/[0.06] bg-black/40 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">15 MB</div>
            <div className="text-xs text-zinc-400 font-medium">Daemon memory at idle</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">7 MB</div>
            <div className="text-xs text-zinc-400 font-medium">Single binary, dashboard included</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">72</div>
            <div className="text-xs text-zinc-400 font-medium">Built-in model blocks</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">0</div>
            <div className="text-xs text-zinc-400 font-medium">Lock-in. Export to plain PyTorch at any time.</div>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Designed for Performance and Autonomy
          </h2>
          <p className="text-sm text-zinc-400">
            Every piece is built to give ML developers and coding agents complete control over models and hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0b0c10] space-y-3 hover:border-white/[0.15] transition-all">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Templates</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Start from a proven architecture instead of a blank file. Ship with vision, sequence, tabular, and generative models, then save your own at the project, machine, or registry level.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0b0c10] space-y-3 hover:border-white/[0.15] transition-all">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Modular by design</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Models are graphs of reusable blocks, and blocks can be built from other blocks. Define a structure once, reuse it everywhere, and change one part without touching the rest.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0b0c10] space-y-3 hover:border-white/[0.15] transition-all">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Built-in observability</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Live metrics, job logs, and CPU, RAM, and GPU usage in one dashboard. Runs are stored in MLflow-compatible format, so your existing tools keep working.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0b0c10] space-y-3 hover:border-white/[0.15] transition-all">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Validated before it runs</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Shape mismatches, invalid parameters, and loss and task conflicts are caught before training starts. Errors point to the exact block at fault.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0b0c10] space-y-3 hover:border-white/[0.15] transition-all">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">No lock-in</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Training runs as standard Python and PyTorch. Export any model as a standalone script with no Sentinel dependency.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0b0c10] space-y-3 hover:border-white/[0.15] transition-all">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Agent-ready</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every action is a CLI command or an HTTP call. Coding agents can design, launch, and inspect experiments without a custom integration.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/[0.06] bg-[#090b10]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">How It Works</h2>
            <p className="text-sm text-zinc-400">From template selection to zero-dependency PyTorch export in four steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0b0c10] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-mono text-sky-400 uppercase tracking-wider font-semibold">Step 01</div>
                <h3 className="font-bold text-white text-base">Choose a template</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Pick a model from the registry or start from your own.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.06] font-mono text-[11px] text-zinc-300 flex items-center justify-between">
                <span>sentinel component list</span>
                <button
                  onClick={() => copyToClipboard("sentinel component list", "step1")}
                  className="hover:text-white"
                >
                  {copiedId === "step1" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0b0c10] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">Step 02</div>
                <h3 className="font-bold text-white text-base">Compose and configure</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Adjust blocks, loss, optimizer, and scheduler in YAML.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.06] font-mono text-[11px] text-zinc-300 flex items-center justify-between">
                <span className="truncate">sentinel component show vision/vit-tiny@v1</span>
                <button
                  onClick={() => copyToClipboard("sentinel component show vision/vit-tiny@v1", "step2")}
                  className="hover:text-white shrink-0 ml-1"
                >
                  {copiedId === "step2" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0b0c10] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">Step 03</div>
                <h3 className="font-bold text-white text-base">Train and observe</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sentinel assigns GPUs, runs the job, and streams metrics to the dashboard.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.06] font-mono text-[11px] text-zinc-300 flex items-center justify-between">
                <span>sentinel run</span>
                <button
                  onClick={() => copyToClipboard("sentinel run", "step3")}
                  className="hover:text-white"
                >
                  {copiedId === "step3" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0b0c10] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">Step 04</div>
                <h3 className="font-bold text-white text-base">Export</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Take the trained model as TorchScript or ONNX, or standalone Python script.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.06] font-mono text-[11px] text-zinc-300 flex items-center justify-between">
                <span className="truncate">sentinel model export &lt;run&gt; -f onnx</span>
                <button
                  onClick={() => copyToClipboard("sentinel model export <run> -f onnx", "step4")}
                  className="hover:text-white shrink-0 ml-1"
                >
                  {copiedId === "step4" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registry Section: Architecture Catalog with Dynamic Git Sync */}
      <section id="architectures" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Dynamic Git Repo Sync Banner */}
        <div className="mb-8 p-3.5 rounded-xl border border-white/[0.08] bg-[#0b0c10] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Live Git Catalog:</span>
            <span className="font-mono text-sky-400">rimraf-adi/sentinel-hub@main</span>
            {latestCommit && (
              <span className="hidden md:inline font-mono text-zinc-500">
                · commit {latestCommit.sha}
              </span>
            )}
            <span className="text-zinc-500">
              ({modules.length} templates dynamic)
            </span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {lastSyncedTime && (
              <span className="text-[11px] text-zinc-500 hidden sm:inline">
                Synced at {lastSyncedTime}
              </span>
            )}
            <button
              onClick={() => fetchLiveRegistry(true)}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-colors border border-white/[0.06] font-mono text-[11px]"
              title="Fetch latest templates from GitHub repository"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin text-sky-400" : ""}`} />
              <span>{isSyncing ? "Syncing Git..." : "Sync from Git"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
              Dynamic Registry
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Architecture catalog</h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Production-ready model templates. Inspect the specification, then add one to your project with a single command.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-lg bg-[#0b0c10] border border-white/[0.1] text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-sky-500 w-full sm:w-60"
              />
            </div>

            <Link
              href="/docs/templates"
              className="text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] transition-colors"
            >
              <span>Installation Guide</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </Link>
          </div>
        </div>

        {/* Domain Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs font-medium mb-8">
          {["all", "vision", "sequence", "tabular", "generative", "graph", "experimental"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg transition-colors capitalize ${
                activeTab === tab
                  ? "bg-white text-zinc-950 font-semibold"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModules.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl border border-white/[0.08] bg-[#0b0c10] hover:border-white/[0.18] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${getDomainBadge(m.domain)}`}>
                    {m.domain}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">{m.component_id}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors mb-1.5">
                  {m.name}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {m.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <code className="text-xs font-mono text-zinc-300">
                  sentinel add {m.id}
                </code>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedModule(m)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                    title="Inspect live YAML specification"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(`sentinel add ${m.id}`, m.id)}
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

      {/* Capability Packs Section */}
      <section id="packs" className="py-20 px-4 sm:px-6 border-t border-white/[0.06] bg-[#090b10]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
                Extensions & Hooks
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Capability packs</h2>
              <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                Optional modules that extend Sentinel. Install only what you need.
              </p>
            </div>

            <Link
              href="/docs/integrations"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] transition-colors self-start md:self-auto"
            >
              <span>Capability Packs Documentation</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((pack) => (
              <div
                key={pack.name}
                className="p-6 rounded-2xl border border-white/[0.08] bg-[#0b0c10] hover:border-white/[0.18] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                      {pack.category}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">{pack.version}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{pack.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{pack.description}</p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <code className="text-xs font-mono text-sky-300">
                    sentinel pack add {pack.name}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`sentinel pack add ${pack.name}`, pack.name)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedId === pack.name ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publish Section */}
      <section id="publish" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Open Registry &amp; Enterprise Spaces
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Publish your own</h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto">
              The registry is open. Publish a module with one command, or keep modules private in your own repository.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0b0c10] space-y-3">
              <div className="text-xs font-semibold text-zinc-300">Community Registry</div>
              <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs text-sky-300 flex items-center justify-between">
                <span>sentinel push components/my-model.yaml</span>
                <button
                  onClick={() => copyToClipboard("sentinel push components/my-model.yaml", "pub-cmd1")}
                  className="hover:text-white"
                >
                  {copiedId === "pub-cmd1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Validates nodes, edges, and parameters, then stages your module for the community registry.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0b0c10] space-y-3">
              <div className="text-xs font-semibold text-zinc-300">Private Git Space</div>
              <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs text-sky-300 flex items-center justify-between">
                <span className="truncate">sentinel config set space https://github.com/my-org/sentinel-space</span>
                <button
                  onClick={() => copyToClipboard("sentinel config set space https://github.com/my-org/sentinel-space", "pub-cmd2")}
                  className="hover:text-white shrink-0 ml-1"
                >
                  {copiedId === "pub-cmd2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Use a private GitHub or GitLab repository for internal modules and policies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section id="install" className="py-20 px-4 sm:px-6 border-t border-white/[0.06] bg-[#090b10] text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Run your first experiment in minutes.
          </h2>
          <p className="text-base text-zinc-300/80 max-w-xl mx-auto">
            Open source. Runs on your hardware. Dual-licensed under Apache 2.0 and MIT.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/docs#quickstart"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4 text-zinc-950" />
              <span>Install Sentinel</span>
            </Link>

            <a
              href="https://github.com/rimraf-adi/sentinel"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-7 py-3 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Live YAML Specification Modal from Git Repo */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b0c10] border border-white/[0.1] rounded-2xl max-w-3xl w-full p-6 space-y-4 glow-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-lg">{selectedModule.name}</h3>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${getDomainBadge(selectedModule.domain)}`}>
                    {selectedModule.domain}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs font-mono text-zinc-400">
                  <span>{selectedModule.component_id}</span>
                  <span>·</span>
                  <span className="text-zinc-500">{selectedModule.path}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="p-1 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">{selectedModule.description}</p>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
                <span>Install Command:</span>
                <button
                  onClick={() => copyToClipboard(`sentinel add ${selectedModule.id}`, "modal-cmd")}
                  className="hover:text-white flex items-center gap-1 text-[11px] font-mono text-sky-400"
                >
                  {copiedId === "modal-cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-black/60 border border-white/[0.06] font-mono text-xs text-sky-300">
                sentinel add {selectedModule.id}
              </div>
            </div>

            {/* Live YAML Specification Viewer */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-sky-400" />
                  <span>Live YAML Specification (from Git):</span>
                </span>
                {selectedModuleYaml && (
                  <button
                    onClick={() => copyToClipboard(selectedModuleYaml, "modal-yaml")}
                    className="hover:text-white flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-sky-300"
                  >
                    {copiedId === "modal-yaml" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy YAML</span>
                  </button>
                )}
              </div>

              <div className="rounded-xl bg-[#070709] border border-white/[0.08] p-3 max-h-72 overflow-y-auto font-mono text-xs text-zinc-300">
                {loadingYaml ? (
                  <div className="py-8 text-center text-zinc-500 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                    <span>Fetching live template from repository...</span>
                  </div>
                ) : (
                  <pre className="whitespace-pre overflow-x-auto text-zinc-300">
                    {selectedModuleYaml}
                  </pre>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06]">
              <a
                href={`https://github.com/rimraf-adi/sentinel-hub/blob/main/${selectedModule.path}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono"
              >
                <Github className="w-3.5 h-3.5" />
                <span>View on GitHub ↗</span>
              </a>

              <div className="flex items-center gap-2">
                <Link
                  href="/docs/templates"
                  className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-white transition-colors"
                  onClick={() => setSelectedModule(null)}
                >
                  View in Templates Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
