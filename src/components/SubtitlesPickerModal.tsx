"use client";

import React from "react";
import { SubtitleStyle, SubtitleFont } from "@/types/kutly";
import { X, Type, Check } from "lucide-react";

interface SubtitlesPickerModalProps {
  open: boolean;
  onClose: () => void;
  subtitlesOn: boolean;
  onToggleSubtitles: (on: boolean) => void;
  selectedStyle: SubtitleStyle;
  onSelectStyle: (style: SubtitleStyle) => void;
  selectedFont: SubtitleFont;
  onSelectFont: (font: SubtitleFont) => void;
}

export function SubtitlesPickerModal({
  open,
  onClose,
  subtitlesOn,
  onToggleSubtitles,
  selectedStyle,
  onSelectStyle,
  selectedFont,
  onSelectFont,
}: SubtitlesPickerModalProps) {
  if (!open) return null;

  const styleOptions: { id: SubtitleStyle; label: string; desc: string }[] = [
    { id: "karaoke", label: "Karaoke Word Glow", desc: "Words illuminate in glowing carrot orange as they are spoken" },
    { id: "word", label: "Pop-in Dynamic Word", desc: "Single bold word pops onto the screen in sync with cadence" },
    { id: "box", label: "Dark Boxed Backdrop", desc: "High-contrast frosted dark pill behind cream text" },
    { id: "clean", label: "Clean Documentary Line", desc: "Classic bottom-third two-line documentary captions" },
  ];

  const fontOptions: { id: SubtitleFont; label: string; fontClass: string }[] = [
    { id: "bebas_neue", label: "Bebas Neue (Punchy & Bold)", fontClass: "font-bebas text-xl" },
    { id: "poppins", label: "Poppins Bold (Clean Modern)", fontClass: "font-poppins font-bold text-lg" },
    { id: "lora", label: "Lora Serif (Cinematic Classic)", fontClass: "font-lora font-semibold text-lg" },
    { id: "inter", label: "Inter Medium (Minimalist)", fontClass: "font-sans font-medium text-base" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#161412] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/8">
          <div>
            <h2 className="text-base font-semibold text-[#FAFAF7] flex items-center gap-2">
              <Type className="w-5 h-5 text-[#D9482E]" />
              Subtitle & Caption Engine
            </h2>
            <p className="text-xs text-[#8C8985] mt-0.5">
              Customize animation dynamics, word highlighting, and typography
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C8985] hover:text-[#FAFAF7] hover:bg-white/6 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Subtitle Master Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1C1A18] border border-white/6">
            <div>
              <p className="font-semibold text-sm text-[#FAFAF7]">Burned-in Video Subtitles</p>
              <p className="text-xs text-[#8C8985] mt-0.5">
                Automatically align speech-to-text timing with motion animations
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToggleSubtitles(!subtitlesOn)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                subtitlesOn ? "bg-[#D9482E]" : "bg-[#252320]"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  subtitlesOn ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Live Preview Box */}
          <div className="relative w-full h-32 rounded-xl bg-[#0E0C0B] border border-white/8 flex flex-col items-center justify-center overflow-hidden shadow-inner">
            <div className="absolute top-2.5 left-3 text-[10px] font-mono text-[#8C8985] uppercase tracking-wider">
              Live Motion Preview
            </div>
            {subtitlesOn ? (
              <div className="text-center px-4">
                {selectedStyle === "karaoke" && (
                  <p className={`${fontOptions.find((f) => f.id === selectedFont)?.fontClass} tracking-wide`}>
                    <span className="text-[#FF7E5F] drop-shadow-[0_0_12px_rgba(255,126,95,0.8)]">
                      THE STRAIT
                    </span>{" "}
                    <span className="text-white">OF MALACCA</span>
                  </p>
                )}
                {selectedStyle === "word" && (
                  <div className="inline-block px-3 py-1 rounded-lg bg-[#D9482E] text-white animate-bounce">
                    <span className={`${fontOptions.find((f) => f.id === selectedFont)?.fontClass}`}>
                      CHOKEPOINT
                    </span>
                  </div>
                )}
                {selectedStyle === "box" && (
                  <div className="inline-block px-4 py-1.5 rounded-lg bg-black/80 border border-white/20 text-white">
                    <span className={`${fontOptions.find((f) => f.id === selectedFont)?.fontClass}`}>
                      Over 94,000 ships pass through
                    </span>
                  </div>
                )}
                {selectedStyle === "clean" && (
                  <p className={`${fontOptions.find((f) => f.id === selectedFont)?.fontClass} text-[#FAFAF7] drop-shadow-md`}>
                    Nearly a quarter of all global seaborne trade.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#8C8985] italic">Subtitles are turned off</p>
            )}
          </div>

          {/* Animation Styles */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-[#A3A09A] uppercase tracking-wider font-mono">
              Animation Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {styleOptions.map((opt) => {
                const isSelected = selectedStyle === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => onSelectStyle(opt.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#D9482E]/15 border-[#D9482E] text-white"
                        : "bg-[#1C1A18] border-white/6 hover:bg-[#252320] text-[#A3A09A]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#FAFAF7]">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#D9482E]" />}
                    </div>
                    <p className="text-[11px] text-[#8C8985] mt-1 leading-snug">{opt.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Typography Choice */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-[#A3A09A] uppercase tracking-wider font-mono">
              Typography
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {fontOptions.map((f) => {
                const isSelected = selectedFont === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => onSelectFont(f.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-[#D9482E]/15 border-[#D9482E]"
                        : "bg-[#1C1A18] border-white/6 hover:bg-[#252320]"
                    }`}
                  >
                    <span className="text-xs font-medium text-[#FAFAF7]">{f.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#D9482E]" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1C1A18] border-t border-white/8">
          <div className="text-xs text-[#8C8985]">
            Status: <strong className="text-[#FAFAF7]">{subtitlesOn ? "Enabled" : "Disabled"}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#D9482E] hover:bg-[#FF7E5F] text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Save Subtitle Settings
          </button>
        </div>
      </div>
    </div>
  );
}
