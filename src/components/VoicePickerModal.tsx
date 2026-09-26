"use client";

import React, { useState, useRef, useEffect } from "react";
import { Voice } from "@/types/kutly";
import { VOICES } from "@/lib/data";
import { X, Search, Volume2, Play, Check, Star, Pause } from "lucide-react";

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
  const [langFilter, setLangFilter] = useState<"all" | "es" | "en">("all");
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!open) return null;

  const filteredVoices = VOICES.filter((voice) => {
    const matchesSearch =
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.accent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === "all" || voice.gender === genderFilter;
    const isSpanishVoice = voice.accent.toLowerCase().includes("spanish");
    const matchesLang =
      langFilter === "all" ||
      (langFilter === "es" && isSpanishVoice) ||
      (langFilter === "en" && !isSpanishVoice);

    return matchesSearch && matchesGender && matchesLang;
  });

  const handlePlayToggle = async (voice: Voice) => {
    if (playingVoiceId === voice.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingVoiceId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setPlayingVoiceId(voice.id);

    try {
      // Request real neural speech sample from /api/tts
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: voice.sampleText,
          voice: voice.edgeVoiceId,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          setPlayingVoiceId(null);
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          setPlayingVoiceId(null);
        };

        await audio.play();
      } else {
        setPlayingVoiceId(null);
      }
    } catch (err) {
      console.warn("TTS preview error:", err);
      setPlayingVoiceId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#161412] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/8">
          <div>
            <h2 className="text-base font-semibold text-[#FAFAF7] flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#D9482E]" />
              Voces y Locutores Neuronales (Edge-TTS)
            </h2>
            <p className="text-xs text-[#8C8985] mt-0.5">
              Voces humanas ultra-realistas en Español e Inglés con entonación documental
            </p>
          </div>
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              onClose();
            }}
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
              placeholder="Buscar por nombre, acento o estilo..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#252320] border border-white/8 text-xs text-[#FAFAF7] placeholder-[#8C8985] focus:outline-none focus:border-[#D9482E]/60 focus:ring-1 focus:ring-[#D9482E]/40"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#8C8985] text-[11px] uppercase tracking-wider font-mono mr-1">
              Idioma:
            </span>
            {[
              { key: "all", label: "Todos" },
              { key: "es", label: "Español (Latam/España)" },
              { key: "en", label: "English" },
            ].map((lang) => (
              <button
                key={lang.key}
                onClick={() => setLangFilter(lang.key as "all" | "es" | "en")}
                className={`px-3 py-1 rounded-full transition-colors text-[11px] cursor-pointer ${
                  langFilter === lang.key
                    ? "bg-[#D9482E] text-white font-semibold"
                    : "bg-[#252320] text-[#A3A09A] hover:text-white"
                }`}
              >
                {lang.label}
              </button>
            ))}

            <div className="w-px h-4 bg-white/10 mx-1 hidden sm:block" />

            <span className="text-[#8C8985] text-[11px] uppercase tracking-wider font-mono mr-1">
              Género:
            </span>
            {(["all", "male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-3 py-1 rounded-full capitalize transition-colors text-[11px] cursor-pointer ${
                  genderFilter === g
                    ? "bg-[#D9482E] text-white font-semibold"
                    : "bg-[#252320] text-[#A3A09A] hover:text-white"
                }`}
              >
                {g === "all" ? "Todos" : g === "male" ? "Hombre" : "Mujer"}
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
                onClick={() => {
                  onSelectVoice(voice);
                  if (audioRef.current) audioRef.current.pause();
                }}
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
                      handlePlayToggle(voice);
                    }}
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-transform shrink-0 cursor-pointer ${
                      isPlaying
                        ? "bg-[#D9482E] text-white scale-105 shadow-md shadow-[#D9482E]/40"
                        : "bg-[#252320] text-[#FAFAF7] hover:bg-[#D9482E] hover:text-white"
                    }`}
                    title={isPlaying ? "Pausar muestra" : "Escuchar muestra de voz"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    )}
                  </button>

                  {/* Voice Meta */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#FAFAF7]">{voice.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#252320] text-[#FF7E5F] border border-white/6">
                        {voice.accent}
                      </span>
                      {voice.isFavorite && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                    <p className="text-xs text-[#8C8985] truncate mt-0.5">{voice.style}</p>
                    <p className="text-[11px] text-[#A3A09A] italic truncate mt-1">
                      &ldquo;{voice.sampleText}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Select Badge */}
                <div className="ml-3 shrink-0">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-[#D9482E] text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-white/10 group-hover:border-white/30" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
