"use client";

import React, { useState } from "react";
import { 
  VideoSettings, 
  DurationOption
} from "@/types/kutly";
import { PROMPT_STARTERS, MUSIC_PACKS } from "@/lib/data";
import { 
  Sparkles, 
  Mic, 
  Clock, 
  Volume2, 
  Palette, 
  Music, 
  Type, 
  Image as ImageIcon, 
  UploadCloud, 
  X, 
  ArrowRight,
  Shuffle,
  Info
} from "lucide-react";

interface ComposerProps {
  settings: VideoSettings;
  onUpdateSettings: (updater: (prev: VideoSettings) => VideoSettings) => void;
  onOpenVoicePicker: () => void;
  onOpenStylePicker: () => void;
  onOpenSubtitlesPicker: () => void;
  onStartGeneration: () => void;
  userCredits: number;
}

export function Composer({
  settings,
  onUpdateSettings,
  onOpenVoicePicker,
  onOpenStylePicker,
  onOpenSubtitlesPicker,
  onStartGeneration,
  userCredits,
}: ComposerProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedMusicId, setSelectedMusicId] = useState<string>("the_investigator");

  const durationCreditCost: Record<DurationOption, number> = {
    "8": 35,
    "14": 60,
    "20": 85,
    "30": 120,
  };

  const currentCost = durationCreditCost[settings.duration];
  const hasEnoughCredits = userCredits >= currentCost;

  const handleShufflePrompt = () => {
    const random = PROMPT_STARTERS[Math.floor(Math.random() * PROMPT_STARTERS.length)];
    onUpdateSettings((prev) => ({ ...prev, topic: random }));
  };

  const handleAudioDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onUpdateSettings((prev) => ({
        ...prev,
        audioFile: file.name,
        topic: `Narrated video based on ${file.name.replace(/\.[^/.]+$/, "")}`,
      }));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Studio Banner / Headline */}
      <div className="text-center space-y-2 pt-2 pb-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9482E]/10 border border-[#D9482E]/20 text-[#FAFAF7] text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#D9482E]" />
          <span>One Prompt · Complete Long-Form Video</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#FAFAF7]">
          Create a faceless documentary in minutes
        </h2>
        <p className="text-xs sm:text-sm text-[#8C8985] max-w-xl mx-auto">
          Scriptwriting, neural voiceover, motion design, visual sequencing, captions & thumbnail.
        </p>
      </div>

      {/* Main Composer Box */}
      <div className="rounded-2xl bg-[#151312] border border-white/8 shadow-2xl overflow-hidden">
        {/* Mode Selector Tabs (Idea vs Voiceover) */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/6 bg-[#161412]">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#252320] border border-white/6 text-xs font-medium">
            <button
              type="button"
              onClick={() => onUpdateSettings((prev) => ({ ...prev, mode: "idea" }))}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                settings.mode === "idea"
                  ? "bg-[#151312] text-[#FAFAF7] font-semibold shadow-sm border border-white/8"
                  : "text-[#8C8985] hover:text-[#FAFAF7]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D9482E]" />
              <span>Idea to Video</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings((prev) => ({ ...prev, mode: "voiceover" }))}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                settings.mode === "voiceover"
                  ? "bg-[#151312] text-[#FAFAF7] font-semibold shadow-sm border border-white/8"
                  : "text-[#8C8985] hover:text-[#FAFAF7]"
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-[#FF7E5F]" />
              <span>Voiceover to Video</span>
            </button>
          </div>

          {/* Prompt Shuffle (only in idea mode) */}
          {settings.mode === "idea" && (
            <button
              type="button"
              onClick={handleShufflePrompt}
              className="flex items-center gap-1.5 text-xs text-[#8C8985] hover:text-[#FAFAF7] transition-colors p-1.5 rounded-lg hover:bg-[#252320]"
              title="Get a random topic idea"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Try an example</span>
            </button>
          )}
        </div>

        {/* Input Area */}
        <div className="p-5">
          {settings.mode === "idea" ? (
            <div className="relative">
              <textarea
                value={settings.topic}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({ ...prev, topic: e.target.value }))
                }
                rows={3}
                maxLength={400}
                placeholder="What should this video be about? e.g. Why the Roman Empire never had an industrial revolution..."
                className="w-full bg-transparent text-sm sm:text-base text-[#FAFAF7] placeholder-[#8C8985] resize-none focus:outline-none leading-relaxed"
              />
              <div className="flex items-center justify-between pt-2 text-[11px] text-[#8C8985] font-mono border-t border-white/4">
                <span>Supports any topic, history, science, true crime, tech & business.</span>
                <span>{settings.topic.length} / 400</span>
              </div>
            </div>
          ) : (
            /* Voiceover Audio Upload Zone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleAudioDrop}
              className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                dragOver
                  ? "border-[#D9482E] bg-[#D9482E]/10"
                  : "border-white/10 hover:border-white/20 bg-[#1C1A18]"
              }`}
            >
              {settings.audioFile ? (
                <div className="flex items-center justify-between w-full max-w-md p-3 rounded-xl bg-[#252320] border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D9482E]/20 text-[#D9482E] flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#FAFAF7]">{settings.audioFile}</p>
                      <p className="text-[10px] text-[#8C8985]">Narration ready for sync</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateSettings((prev) => ({ ...prev, audioFile: null }));
                    }}
                    className="p-1 rounded-lg text-[#8C8985] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-[#D9482E] mb-2" />
                  <p className="text-xs font-semibold text-[#FAFAF7]">
                    Drop your narration audio here, or{" "}
                    <span className="text-[#FF7E5F] underline">browse files</span>
                  </p>
                  <p className="text-[11px] text-[#8C8985] mt-1">
                    MP3, WAV, M4A · 8 to 30 minutes · up to 100 MB
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Configuration Chips Bar */}
        <div className="px-5 py-3.5 bg-[#1C1A18] border-t border-white/6 flex flex-wrap items-center gap-2.5">
          {/* Duration Selector */}
          <div className="flex items-center p-1 rounded-xl bg-[#252320] border border-white/6 text-xs">
            <span className="text-[#8C8985] px-2 text-[11px] font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#D9482E]" />
            </span>
            {(["8", "14", "20", "30"] as DurationOption[]).map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => onUpdateSettings((prev) => ({ ...prev, duration: dur }))}
                className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-colors ${
                  settings.duration === dur
                    ? "bg-[#D9482E] text-white font-bold"
                    : "text-[#A3A09A] hover:text-[#FAFAF7]"
                }`}
              >
                {dur}m
              </button>
            ))}
          </div>

          {/* Voice Picker Chip */}
          {settings.mode === "idea" && (
            <button
              type="button"
              onClick={onOpenVoicePicker}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#252320] hover:bg-[#2A2825] border border-white/6 text-xs text-[#FAFAF7] transition-colors cursor-pointer group"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#FF7E5F]" />
              <span>
                Voice: <strong className="font-semibold">{settings.voice.name}</strong>
              </span>
            </button>
          )}

          {/* Style Pack Chip */}
          <button
            type="button"
            onClick={onOpenStylePicker}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#252320] hover:bg-[#2A2825] border border-white/6 text-xs text-[#FAFAF7] transition-colors cursor-pointer group"
          >
            <Palette className="w-3.5 h-3.5 text-[#FF7E5F]" />
            <span>
              Style: <strong className="font-semibold">{settings.stylePack.name}</strong>
            </span>
          </button>

          {/* Subtitles Chip */}
          <button
            type="button"
            onClick={onOpenSubtitlesPicker}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
              settings.subtitlesOn
                ? "bg-[#D9482E]/15 border-[#D9482E]/40 text-[#FAFAF7]"
                : "bg-[#252320] border-white/6 text-[#8C8985]"
            }`}
          >
            <Type className="w-3.5 h-3.5 text-[#D9482E]" />
            <span>
              Subtitles: <strong>{settings.subtitlesOn ? "On" : "Off"}</strong>
            </span>
          </button>

          {/* Music Picker */}
          <div className="relative">
            <select
              value={selectedMusicId}
              onChange={(e) => {
                setSelectedMusicId(e.target.value);
                const pack = MUSIC_PACKS.find((m) => m.id === e.target.value);
                onUpdateSettings((prev) => ({ ...prev, music: pack || "none" }));
              }}
              className="appearance-none pl-7 pr-7 py-1.5 rounded-xl bg-[#252320] border border-white/6 text-xs text-[#FAFAF7] focus:outline-none cursor-pointer"
            >
              {MUSIC_PACKS.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#1C1A18] text-white">
                  Music: {m.name}
                </option>
              ))}
              <option value="none" className="bg-[#1C1A18] text-white">
                Music: None
              </option>
            </select>
            <Music className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#FF7E5F] pointer-events-none" />
          </div>

          {/* Auto-Thumbnail Checkbox */}
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#252320] border border-white/6 text-xs text-[#FAFAF7] cursor-pointer hover:bg-[#2A2825] transition-colors">
            <input
              type="checkbox"
              checked={settings.genThumbnail}
              onChange={(e) =>
                onUpdateSettings((prev) => ({ ...prev, genThumbnail: e.target.checked }))
              }
              className="accent-[#D9482E] rounded"
            />
            <ImageIcon className="w-3.5 h-3.5 text-[#D9482E]" />
            <span>Auto Thumbnail</span>
          </label>
        </div>

        {/* Action / Cost Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-[#151312] border-t border-white/8 gap-4">
          <div className="flex items-center gap-2 text-xs text-[#8C8985]">
            <Info className="w-4 h-4 text-[#D9482E]" />
            <span>
              Production cost:{" "}
              <strong className="text-[#FAFAF7] font-mono font-semibold">{currentCost} credits</strong>{" "}
              ({settings.duration} min duration, 1080p export)
            </span>
          </div>

          <button
            type="button"
            onClick={onStartGeneration}
            disabled={!hasEnoughCredits || (!settings.topic.trim() && !settings.audioFile)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer shadow-lg ${
              !hasEnoughCredits || (!settings.topic.trim() && !settings.audioFile)
                ? "bg-[#252320] text-[#8C8985] cursor-not-allowed"
                : "bg-gradient-to-r from-[#D9482E] to-[#FF7E5F] hover:from-[#FF7E5F] hover:to-[#D9482E] text-white shadow-[#D9482E]/25 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
            <span>Generate Full Video</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
