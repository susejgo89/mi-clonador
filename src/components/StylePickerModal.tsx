"use client";

import React from "react";
import { StylePack } from "@/types/kutly";
import { STYLE_PACKS } from "@/lib/data";
import { X, Palette, Check } from "lucide-react";

interface StylePickerModalProps {
  open: boolean;
  onClose: () => void;
  selectedStyle: StylePack;
  onSelectStyle: (style: StylePack) => void;
}

export function StylePickerModal({
  open,
  onClose,
  selectedStyle,
  onSelectStyle,
}: StylePickerModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#161412] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/8">
          <div>
            <h2 className="text-base font-semibold text-[#FAFAF7] flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#D9482E]" />
              Visual Style Pack
            </h2>
            <p className="text-xs text-[#8C8985] mt-0.5">
              Determines motion design aesthetic, color grade, pacing, and visual transitions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C8985] hover:text-[#FAFAF7] hover:bg-white/6 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STYLE_PACKS.map((pack) => {
            const isSelected = selectedStyle.id === pack.id;
            return (
              <div
                key={pack.id}
                onClick={() => onSelectStyle(pack)}
                className={`group relative rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? "bg-[#D9482E]/12 border-[#D9482E] ring-2 ring-[#D9482E]/30 shadow-lg"
                    : "bg-[#1C1A18] border-white/6 hover:border-white/15 hover:bg-[#232120]"
                }`}
              >
                {/* Visual Preview Image */}
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3 bg-[#252320]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pack.previewUrl}
                    alt={pack.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-transparent to-transparent opacity-80" />

                  {pack.tag && (
                    <span
                      className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase shadow-md ${
                        pack.tag === "PREMIUM"
                          ? "bg-amber-500/90 text-black"
                          : pack.tag === "NEW"
                          ? "bg-[#D9482E] text-white"
                          : "bg-black/60 text-white backdrop-blur-md"
                      }`}
                    >
                      {pack.tag}
                    </span>
                  )}

                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#D9482E] flex items-center justify-center text-white shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-semibold text-sm text-[#FAFAF7] flex items-center justify-between">
                    <span>{pack.name}</span>
                  </h3>
                  <p className="text-xs text-[#8C8985] mt-1 line-clamp-2 leading-relaxed">
                    {pack.description}
                  </p>
                </div>

                {/* Color Swatches */}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/6">
                  <span className="text-[10px] font-mono text-[#8C8985] uppercase mr-1">Grade:</span>
                  {pack.colorScheme.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1C1A18] border-t border-white/8">
          <div className="text-xs text-[#8C8985]">
            Active Style: <strong className="text-[#FAFAF7]">{selectedStyle.name}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#D9482E] hover:bg-[#FF7E5F] text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Confirm Style
          </button>
        </div>
      </div>
    </div>
  );
}
