import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#070709] py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo size={24} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">Sentinel Hub</span>
              <span className="text-zinc-600 text-xs">·</span>
              <span className="text-zinc-400 text-xs">Model templates and training infrastructure</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
          <a
            href="https://github.com/rimraf-adi/sentinel"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            Sentinel Core
          </a>
          <Link href="/" className="hover:text-white transition-colors">
            Sentinel Hub
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            Documentation
          </Link>
          <a
            href="https://github.com/rimraf-adi/sentinel/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            License
          </a>
        </div>
      </div>
    </footer>
  );
}
