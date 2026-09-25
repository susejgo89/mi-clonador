"use client";

import React, { useState } from "react";
import { User, Key, Copy, Check } from "lucide-react";
import { YouTubeIcon } from "@/components/icons";

export function AccountView() {
  const [copiedKey, setCopiedKey] = useState(false);
  const apiKey = "kutly_live_99a8f2378c89410ea2b918f6d";

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#FAFAF7]">Workspace Settings</h2>
        <p className="text-xs text-[#8C8985] mt-0.5">
          Manage creator profile, connected YouTube channels, API tokens, and webhooks
        </p>
      </div>

      <div className="space-y-6">
        {/* Creator Profile */}
        <div className="p-6 rounded-2xl bg-[#151312] border border-white/6 space-y-4">
          <h3 className="text-sm font-semibold text-[#FAFAF7] flex items-center gap-2">
            <User className="w-4 h-4 text-[#D9482E]" />
            Creator Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#8C8985] block mb-1">Studio Name</label>
              <input
                type="text"
                defaultValue="Apex Documentary Studio"
                className="w-full px-3.5 py-2 rounded-xl bg-[#252320] border border-white/8 text-xs text-[#FAFAF7] focus:outline-none focus:border-[#D9482E]"
              />
            </div>
            <div>
              <label className="text-xs text-[#8C8985] block mb-1">Contact Email</label>
              <input
                type="email"
                defaultValue="creator@kutly-studio.io"
                className="w-full px-3.5 py-2 rounded-xl bg-[#252320] border border-white/8 text-xs text-[#FAFAF7] focus:outline-none focus:border-[#D9482E]"
              />
            </div>
          </div>
        </div>

        {/* Connected YouTube Channel */}
        <div className="p-6 rounded-2xl bg-[#151312] border border-white/6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#FAFAF7] flex items-center gap-2">
              <YouTubeIcon className="w-4 h-4 text-red-500" />
              Connected YouTube Channel
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold uppercase">
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1C1A18] border border-white/6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 font-bold">
                <YouTubeIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#FAFAF7]">The Deep Dive Files</p>
                <p className="text-[11px] text-[#8C8985]">248k Subscribers · Auto-upload enabled</p>
              </div>
            </div>

            <button
              onClick={() => alert("Managing YouTube API token permissions...")}
              className="px-3 py-1.5 rounded-lg bg-[#252320] hover:bg-white/10 text-xs text-[#FAFAF7] transition-colors"
            >
              Manage Channel
            </button>
          </div>
        </div>

        {/* API Tokens */}
        <div className="p-6 rounded-2xl bg-[#151312] border border-white/6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#FAFAF7] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#FF7E5F]" />
              API Key (for automated n8n / Zapier scripts)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="password"
              readOnly
              value={apiKey}
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#252320] border border-white/8 text-xs font-mono text-[#FAFAF7] focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#252320] hover:bg-[#D9482E] text-xs font-semibold text-[#FAFAF7] transition-colors cursor-pointer"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
