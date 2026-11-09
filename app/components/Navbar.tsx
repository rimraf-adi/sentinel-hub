"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { Github, Menu, X, Terminal, ArrowUpRight, BookOpen, Layers, Package, Download, Sun, Moon } from "lucide-react";

export function Navbar({ activePage = "" }: { activePage?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("sentinel_hub_theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
      document.documentElement.classList.toggle("light", saved === "light");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.classList.toggle("dark", initial === "dark");
      document.documentElement.classList.toggle("light", initial === "light");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("sentinel_hub_theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.classList.toggle("light", next === "light");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#070709]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo size={28} />
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base group-hover:text-sky-300 transition-colors">
                Sentinel Hub
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                v1.0
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Catalog and Docs Only) */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-400">
            <Link
              href="/catalog"
              className={`px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.05] transition-colors ${
                activePage === "catalog" ? "text-white bg-white/[0.08]" : ""
              }`}
            >
              Catalog
            </Link>
            <Link
              href="/docs"
              className={`px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.05] transition-colors ${
                activePage === "docs" ? "text-white bg-white/[0.08]" : ""
              }`}
            >
              Docs
            </Link>
          </nav>
        </div>

        {/* Right CTA / GitHub */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors"
          >
            {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
          <a
            href="https://github.com/rimraf-adi/sentinel"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-xs text-zinc-300 font-mono transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <Link
            href="/docs#install"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs transition-colors shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5 text-zinc-900" />
            <span>Get Sentinel</span>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#090b10] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-1 text-sm font-medium">
            <Link
              href="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-white/[0.05] text-zinc-300 hover:text-white"
            >
              Catalog
            </Link>
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-white/[0.05] text-zinc-300 hover:text-white"
            >
              Docs
            </Link>
          </div>
          <div className="pt-3 border-t border-white/[0.08] flex items-center gap-3">
            <a
              href="https://github.com/rimraf-adi/sentinel"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/[0.1] text-xs text-zinc-300 font-mono"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <Link
              href="/docs#install"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white text-zinc-950 font-semibold text-xs"
            >
              <Terminal className="w-4 h-4" />
              <span>Get Sentinel</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
