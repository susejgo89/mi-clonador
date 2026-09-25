"use client";

import React from "react";
import { 
  Sparkles, 
  Film, 
  CreditCard, 
  Settings, 
  Plus, 
  ChevronRight, 
  PanelLeftClose, 
  PanelLeft
} from "lucide-react";

interface SidebarProps {
  currentView: "home" | "projects" | "pricing" | "account";
  onViewChange: (view: "home" | "projects" | "pricing" | "account") => void;
  credits: number;
  maxCredits: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenPricing: () => void;
}

export function Sidebar({
  currentView,
  onViewChange,
  credits,
  maxCredits,
  collapsed,
  onToggleCollapse,
  onOpenPricing,
}: SidebarProps) {
  const creditPercentage = Math.min(100, Math.round((credits / maxCredits) * 100));

  const navItems = [
    { id: "home" as const, label: "Studio", icon: Sparkles, badge: "AI" },
    { id: "projects" as const, label: "My Videos", icon: Film, badge: "3" },
    { id: "pricing" as const, label: "Plans & Credits", icon: CreditCard },
    { id: "account" as const, label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col justify-between border-r border-white/8 bg-[#151312] transition-all duration-300 z-30 shrink-0 ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Top Section: Logo & Toggle */}
      <div>
        <div className="flex items-center justify-between px-4 py-4.5 border-b border-white/6">
          <div 
            onClick={() => onViewChange("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-xl bg-[#D9482E] flex items-center justify-center shadow-lg shadow-[#D9482E]/25 group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 500 500" fill="none">
                <path
                  d="M212.26 25C214.089 27.1198 220.898 42.8216 222.639 46.495L239.906 82.6477C244.902 93.2087 250.707 105.826 256.229 115.908C265.034 94.8771 274.741 74.9868 283.657 54.2567C287.346 61.4635 290.554 69.995 293.762 77.5257C306.325 107.013 316.118 134.872 337.636 159.321C366.496 192.112 405.632 202.535 448 205.046C428.024 225.865 402.366 237.629 376.415 249.284C362.324 255.613 349.98 260.692 337.585 270.11C309.493 291.453 301.885 329.887 291.173 361.766C286.052 377.243 280.051 392.418 273.199 407.218C264.422 426.418 253.576 445.174 242.43 463.091C240.196 466.681 237.783 470.313 235.731 474C234.981 471.978 234.237 469.861 233.618 467.771C221.883 428.151 206.462 384.601 220.736 343.584C223.061 336.902 226.81 330.476 230.476 324.505C265.247 273.042 321.387 253.331 376.378 231.313C379.361 230.119 382.375 228.76 385.337 227.49C378.935 228.743 363.468 229.338 356.081 229.958C323.468 232.697 294.716 237.382 266.874 255.582C237.288 274.923 219.964 300.517 211.056 334.41C208.769 343.108 207.562 351.127 205.72 359.791C202.373 351.858 199.497 342.94 196.256 334.799C190.989 321.739 184.616 309.148 177.207 297.162C153.693 259.859 121.192 236.884 79.3041 223.381C70.6699 220.598 61.8395 218.618 53 216.6C68.953 210.344 84.0595 205.864 100.323 198.897C162.603 172.216 180.895 123.12 200.005 62.6084C203.408 51.8311 208.269 35.4119 212.26 25Z"
                  fill="white"
                />
              </svg>
            </div>
            {!collapsed && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-lg tracking-tight text-[#FAFAF7]">Kutly</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-[#252320] text-[#A3A09A] border border-white/6">
                  STUDIO
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="text-[#8C8985] hover:text-[#FAFAF7] hover:bg-white/6 p-1.5 rounded-lg transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-[#D9482E]/15 text-[#FAFAF7] border border-[#D9482E]/30 shadow-sm"
                    : "text-[#A3A09A] hover:text-[#FAFAF7] hover:bg-[#1C1A18]"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                    isActive ? "text-[#D9482E]" : "text-[#8C8985] group-hover:text-[#FAFAF7]"
                  }`}
                />
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-[#D9482E] text-white font-bold"
                            : "bg-[#252320] text-[#8C8985]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Credits Bar & User Profile */}
      <div className="p-3 space-y-3 border-t border-white/6">
        {/* Credits Widget */}
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-[#1C1A18] border border-white/6 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8C8985] font-medium">Credits</span>
              <span className="font-mono font-semibold text-[#FAFAF7]">
                {credits} <span className="text-[#8C8985] font-normal">/ {maxCredits}</span>
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-[#252320] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D9482E] to-[#FF7E5F] transition-all duration-500"
                style={{ width: `${creditPercentage}%` }}
              />
            </div>
            <button
              onClick={onOpenPricing}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#252320] hover:bg-[#D9482E] text-xs font-semibold text-[#FAFAF7] hover:text-white transition-colors group cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
              <span>Add Credits</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenPricing}
            className="w-full flex flex-col items-center justify-center p-2 rounded-xl bg-[#1C1A18] hover:bg-[#D9482E]/20 border border-white/6 text-xs text-[#FAFAF7] transition-colors"
            title={`${credits} credits remaining. Click to add more.`}
          >
            <Sparkles className="w-4 h-4 text-[#D9482E]" />
            <span className="text-[10px] font-mono mt-1">{credits}</span>
          </button>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1C1A18] transition-colors cursor-pointer group">
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#D9482E] to-[#7A1F2C] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-inner">
            CS
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#151312]" />
          </div>
          {!collapsed && (
            <div className="flex items-center justify-between w-full min-w-0">
              <div className="truncate">
                <p className="text-xs font-semibold text-[#FAFAF7] truncate">Creator Studio</p>
                <p className="text-[11px] text-[#8C8985] truncate">Creator Plan</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8C8985] group-hover:text-[#FAFAF7] group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
