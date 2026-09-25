"use client";

import React from "react";
import { HelpCircle, Bell, ExternalLink, Zap } from "lucide-react";

interface HeaderProps {
  currentView: "home" | "projects" | "pricing" | "account";
  credits: number;
  onOpenPricing: () => void;
}

export function Header({ currentView, credits, onOpenPricing }: HeaderProps) {
  const getTitle = () => {
    switch (currentView) {
      case "home":
        return "AI Video Studio";
      case "projects":
        return "My Generated Videos";
      case "pricing":
        return "Pricing & Production Credits";
      case "account":
        return "Workspace Settings";
      default:
        return "Studio";
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 bg-[#0E0C0B]/90 backdrop-blur-md border-b border-white/6">
      {/* View Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold tracking-tight text-[#FAFAF7]">{getTitle()}</h1>
        {currentView === "home" && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D9482E]/10 border border-[#D9482E]/25 text-[#D9482E] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9482E] animate-pulse-dot" />
            V2.4 Ready
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Credits Quick Pill */}
        <button
          onClick={onOpenPricing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C1A18] hover:bg-[#252320] border border-white/8 hover:border-[#D9482E]/40 text-xs font-medium text-[#FAFAF7] transition-all cursor-pointer group shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-[#D9482E] group-hover:scale-110 transition-transform" />
          <span>
            <strong className="font-mono font-semibold">{credits}</strong> credits
          </span>
          <span className="hidden sm:inline text-[10px] text-[#8C8985] group-hover:text-[#FAFAF7]">
            + Top up
          </span>
        </button>

        {/* Documentation / Community */}
        <a
          href="https://kutly.io"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#1C1A18] text-xs text-[#A3A09A] hover:text-[#FAFAF7] transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Documentation</span>
          <ExternalLink className="w-3 h-3 text-[#8C8985]" />
        </a>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-full hover:bg-[#1C1A18] text-[#8C8985] hover:text-[#FAFAF7] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D9482E]" />
        </button>
      </div>
    </header>
  );
}
