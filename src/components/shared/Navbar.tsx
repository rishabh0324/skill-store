"use client";

import React from "react";
import Link from "next/link";
import { RoleSwitcher } from "./RoleSwitcher";
import { NotificationDropdown } from "./NotificationDropdown";
import { Sparkles, Layers, ShieldCheck } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-primary-500 to-accent-cyan p-0.5 shadow-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="text-accent-cyan w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">
                NEXUS<span className="text-accent-cyan">EDU</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-300 border border-primary-500/30">
                SIH'26
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Academia–Industry Collaboration Engine</p>
          </div>
        </Link>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-3">
          <RoleSwitcher />
          <NotificationDropdown />

          <Link
            href="/p/aarav-sharma"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-accent-cyan/10 hover:bg-accent-cyan/20 text-cyan-300 border border-cyan-500/30 transition-colors"
          >
            <ShieldCheck size={14} />
            <span>Public Portfolio</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
