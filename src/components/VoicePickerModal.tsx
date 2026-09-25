"use client";

import React, { useState } from "react";
import { Voice } from "@/types/kutly";
import { VOICES } from "@/lib/data";
import { X, Search, Volume2, Play, Check, Star } from "lucide-react";

interface VoicePickerModalProps {
  open: boolean;
  onClose: () => void;
  selectedVoice: Voice;
  onSelectVoice: (voice: Voice) => void;
}

export function VoicePickerModal({
  open,
  onClose,
  selectedVoice,
  onSelectVoice,
}: VoicePickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
  const [accentFilter, setAccentFilter] = useState<string>("all");
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  if (!open) return null;

  const filteredVoices = VOICES.filter((voice) => {
    const matchesSearch =
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.accent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === "all" || voice.gender === genderFilter;
    const matchesAccent = accentFilter === "all" || voice.accent === accentFilter;
    return matchesSearch && matchesGender && matchesAccent;
  });

  const handlePlayToggle = (voiceId: string) => {
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(voiceId);
      // Auto stop after 4 seconds
      setTimeout(() => {
        setPlayingVoiceId((prev) => (prev === voiceId ? null : prev));
      }, 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#161412] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/8">
          <div>
            <h2 className="text-base font-semibold text-[#FAFAF7] flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#D9482E]" />
              Select Voice & Narrator
            </h2>
            <p className="text-xs text-[#8C8985] mt-0.5">
              Studio-grade AI neural voices with emotive documentary inflection
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C8985] hover:text-[#FAFAF7] hover:bg-white/6 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-[#1C1A18] border-b border-white/6 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8985]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by voice name, accent, or style..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#252320] border border-white/8 text-xs text-[#FAFAF7] placeholder-[#8C8985] focus:outline-none focus:border-[#D9482E]/60 focus:ring-1 focus:ring-[#D9482E]/40"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[#8C8985] text-[11px] uppercase tracking-wider font-mono mr-1">
              Gender:
            </span>
            {(["all", "male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-3 py-1 rounded-full capitalize transition-colors ${
                  genderFilter === g
                    ? "bg-[#D9482E] text-white font-medium"
                    : "bg-[#252320] text-[#A3A09A] hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}

            <div className="w-px h-4 bg-white/10 mx-1" />

            <span className="text-[#8C8985] text-[11px] uppercase tracking-wider font-mono mr-1">
              Accent:
            </span>
            {["all", "American", "British", "Australian"].map((acc) => (
              <button
                key={acc}
                onClick={() => setAccentFilter(acc)}
                className={`px-3 py-1 rounded-full capitalize transition-colors ${
                  accentFilter === acc
                    ? "bg-[#D9482E] text-white font-medium"
                    : "bg-[#252320] text-[#A3A09A] hover:text-white"
                }`}
              >
                {acc}
              </button>
            ))}
          </div>
        </div>

        {/* Voice List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredVoices.map((voice) => {
            const isSelected = selectedVoice.id === voice.id;
            const isPlaying = playingVoiceId === voice.id;

            return (
              <div
                key={voice.id}
                onClick={() => onSelectVoice(voice)}
                className={`relative flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer group ${
                  isSelected
                    ? "bg-[#D9482E]/12 border-[#D9482E]/50 shadow-md"
                    : "bg-[#1C1A18] border-white/6 hover:border-white/15 hover:bg-[#232120]"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Play / Sample Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayToggle(voice.id);
                    }}
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-transform shrink-0 ${
                      isPlaying
                        ? "bg-[#D9482E] text-white scale-105"
                        : "bg-[#252320] text-[#FAFAF7] hover:bg-[#D9482E] hover:text-white"
                    }`}
                    title={isPlaying ? "Pause sample" : "Play voice sample"}
                  >
                    {isPlaying ? (
                      <div className="flex items-center gap-0.5">
                        <span className="w-1 bg-white rounded-full animate-waveform-1" />
                        <span className="w-1 bg-white rounded-full animate-waveform-2" />
                        <span className="w-1 bg-white rounded-full animate-waveform-3" />
                      </div>
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>

                  {/* Voice Meta */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#FAFAF7]">{voice.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#252320] text-[#A3A09A] border border-white/6">
                        {voice.accent} · {voice.gender}
                      </span>
                      {voice.isFavorite && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                    <p className="text-xs text-[#8C8985] truncate mt-0.5">{voice.style}</p>
                    {isPlaying && (
                      <p className="text-[11px] text-[#FF7E5F] italic mt-1 animate-in fade-in duration-150">
                        &ldquo;{voice.sampleText}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Selected Indicator */}
                <div className="shrink-0 pl-3">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-[#D9482E] flex items-center justify-center text-white shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-white/10 group-hover:border-white/30" />
                  )}
                </div>
              </div>
            );
          })}

          {filteredVoices.length === 0 && (
            <div className="py-12 text-center text-[#8C8985] text-xs">
              No voices match your search criteria.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1C1A18] border-t border-white/8">
          <div className="text-xs text-[#8C8985]">
            Selected: <strong className="text-[#FAFAF7]">{selectedVoice.name}</strong> ({selectedVoice.accent})
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#D9482E] hover:bg-[#FF7E5F] text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Confirm Voice
          </button>
        </div>
      </div>
    </div>
  );
}
