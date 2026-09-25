"use client";

import React from "react";
import { VideoSettings } from "@/types/kutly";
import { VOICES, STYLE_PACKS } from "@/lib/data";
import { Sparkles, Volume2, Palette, ArrowUpRight } from "lucide-react";

interface PresetCardsProps {
  onApplyPreset: (settings: Partial<VideoSettings>) => void;
}

export function PresetCards({ onApplyPreset }: PresetCardsProps) {
  const presets = [
    {
      id: "docu-malacca",
      title: "Geopolitics & Maritime Trade",
      topic: "The Strait of Malacca: The Chokepoint That Controls 25% of Global Trade",
      duration: "20" as const,
      voice: VOICES.find((v) => v.id === "simon") || VOICES[0],
      stylePack: STYLE_PACKS.find((s) => s.id === "velvet") || STYLE_PACKS[0],
      subtitles: true,
      badge: "POPULAR",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "tech-nvidia",
      title: "Tech Industry Deep Dive",
      topic: "How NVIDIA conquered the AI chip market through a 30-year engineering gamble",
      duration: "14" as const,
      voice: VOICES.find((v) => v.id === "david") || VOICES[1],
      stylePack: STYLE_PACKS.find((s) => s.id === "cinematic") || STYLE_PACKS[2],
      subtitles: true,
      badge: "TRENDING",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "history-rome",
      title: "Ancient Military Strategy",
      topic: "The Battle of Cannae: Hannibal's Masterpiece of Double Encirclement",
      duration: "30" as const,
      voice: VOICES.find((v) => v.id === "olivia") || VOICES[0],
      stylePack: STYLE_PACKS.find((s) => s.id === "noir") || STYLE_PACKS[1],
      subtitles: true,
      badge: "DOCUMENTARY",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "crime-mystery",
      title: "Unsolved Mystery Breakdown",
      topic: "The Mystery of Flight MH370: Ocean currents, radar data and satellite analysis",
      duration: "20" as const,
      voice: VOICES.find((v) => v.id === "marcus") || VOICES[2],
      stylePack: STYLE_PACKS.find((s) => s.id === "noir") || STYLE_PACKS[1],
      subtitles: true,
      badge: "TRUE CRIME",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#FAFAF7] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D9482E]" />
          Instant Video Formats & Presets
        </h3>
        <span className="text-xs text-[#8C8985]">Click any template to auto-fill studio parameters</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {presets.map((preset) => (
          <div
            key={preset.id}
            onClick={() =>
              onApplyPreset({
                topic: preset.topic,
                duration: preset.duration,
                voice: preset.voice,
                stylePack: preset.stylePack,
                subtitlesOn: preset.subtitles,
              })
            }
            className="group relative rounded-xl bg-[#151312] border border-white/6 hover:border-[#D9482E]/40 p-3 flex flex-col justify-between transition-all cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D9482E]/10"
          >
            {/* Thumbnail Preview */}
            <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2.5 bg-[#252320]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preset.image}
                alt={preset.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-black/60 text-white backdrop-blur-sm">
                {preset.badge}
              </span>
              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white">
                {preset.duration}m
              </span>
            </div>

            {/* Info */}
            <div className="space-y-1">
              <h4 className="font-semibold text-xs text-[#FAFAF7] group-hover:text-[#FF7E5F] transition-colors flex items-center justify-between">
                <span>{preset.title}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#8C8985] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </h4>
              <p className="text-[11px] text-[#8C8985] line-clamp-2 leading-relaxed">
                {preset.topic}
              </p>
            </div>

            {/* Meta tags */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/6 text-[10px] text-[#8C8985] font-mono">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-[#FF7E5F]" />
                {preset.voice.name}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Palette className="w-3 h-3 text-[#FF7E5F]" />
                {preset.stylePack.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
