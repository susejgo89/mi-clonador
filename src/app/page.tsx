"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Composer } from "@/components/Composer";
import { PresetCards } from "@/components/PresetCards";
import { VoicePickerModal } from "@/components/VoicePickerModal";
import { StylePickerModal } from "@/components/StylePickerModal";
import { SubtitlesPickerModal } from "@/components/SubtitlesPickerModal";
import { GeneratingModal } from "@/components/GeneratingModal";
import { ProjectsView } from "@/components/ProjectsView";
import { PricingView } from "@/components/PricingView";
import { AccountView } from "@/components/AccountView";
import { VideoPlayerModal } from "@/components/VideoPlayerModal";
import { VideoSettings, GeneratedVideo } from "@/types/kutly";
import { VOICES, STYLE_PACKS, MUSIC_PACKS, INITIAL_VIDEOS } from "@/lib/data";

export default function Home() {
  const [currentView, setCurrentView] = useState<"home" | "projects" | "pricing" | "account">("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [credits, setCredits] = useState(120);
  const maxCredits = 2000;

  // Video Settings state
  const [settings, setSettings] = useState<VideoSettings>({
    mode: "idea",
    topic: "",
    audioFile: null,
    duration: "14",
    voice: VOICES[0],
    stylePack: STYLE_PACKS[0],
    music: MUSIC_PACKS[0],
    subtitlesOn: true,
    subtitleStyle: "karaoke",
    subtitleFont: "bebas_neue",
    genThumbnail: true,
    thumbnailStyles: ["breaking_news", "vs_duel"],
  });

  // Modals state
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [styleModalOpen, setStyleModalOpen] = useState(false);
  const [subtitlesModalOpen, setSubtitlesModalOpen] = useState(false);
  const [generatingModalOpen, setGeneratingModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(null);

  // Videos collection
  const [videos, setVideos] = useState<GeneratedVideo[]>(INITIAL_VIDEOS);

  const handleAddCredits = (amount: number) => {
    setCredits((prev) => prev + amount);
  };

  const handleApplyPreset = (presetSettings: Partial<VideoSettings>) => {
    setSettings((prev) => ({ ...prev, ...presetSettings }));
  };

  const handleFinishGeneration = (newVideo: GeneratedVideo) => {
    setVideos((prev) => [newVideo, ...prev]);
    setCredits((prev) => Math.max(0, prev - (settings.duration === "8" ? 35 : settings.duration === "14" ? 60 : settings.duration === "20" ? 85 : 120)));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0E0C0B] text-[#FAFAF7]">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        credits={credits}
        maxCredits={maxCredits}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenPricing={() => setCurrentView("pricing")}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0E0C0B]">
        {/* Top Header */}
        <Header
          currentView={currentView}
          credits={credits}
          onOpenPricing={() => setCurrentView("pricing")}
        />

        {/* Dynamic View Scroll Container */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 space-y-8">
          {currentView === "home" && (
            <>
              {/* Studio Composer */}
              <Composer
                settings={settings}
                onUpdateSettings={setSettings}
                onOpenVoicePicker={() => setVoiceModalOpen(true)}
                onOpenStylePicker={() => setStyleModalOpen(true)}
                onOpenSubtitlesPicker={() => setSubtitlesModalOpen(true)}
                onStartGeneration={() => setGeneratingModalOpen(true)}
                userCredits={credits}
              />

              {/* Instant Preset Cards */}
              <PresetCards onApplyPreset={handleApplyPreset} />
            </>
          )}

          {currentView === "projects" && (
            <ProjectsView
              videos={videos}
              onOpenStudio={() => setCurrentView("home")}
              onSelectVideo={(video) => {
                setSelectedVideo(video);
              }}
            />
          )}

          {currentView === "pricing" && (
            <PricingView
              onSelectPlan={(planId) => {
                console.log("Selected plan:", planId);
              }}
              onAddCredits={handleAddCredits}
            />
          )}

          {currentView === "account" && <AccountView />}
        </main>
      </div>

      {/* Pickers & Flow Modals */}
      <VoicePickerModal
        open={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        selectedVoice={settings.voice}
        onSelectVoice={(voice) => {
          setSettings((prev) => ({ ...prev, voice }));
          setVoiceModalOpen(false);
        }}
      />

      <StylePickerModal
        open={styleModalOpen}
        onClose={() => setStyleModalOpen(false)}
        selectedStyle={settings.stylePack}
        onSelectStyle={(stylePack) => {
          setSettings((prev) => ({ ...prev, stylePack }));
          setStyleModalOpen(false);
        }}
      />

      <SubtitlesPickerModal
        open={subtitlesModalOpen}
        onClose={() => setSubtitlesModalOpen(false)}
        subtitlesOn={settings.subtitlesOn}
        onToggleSubtitles={(on) => setSettings((prev) => ({ ...prev, subtitlesOn: on }))}
        selectedStyle={settings.subtitleStyle}
        onSelectStyle={(subtitleStyle) => setSettings((prev) => ({ ...prev, subtitleStyle }))}
        selectedFont={settings.subtitleFont}
        onSelectFont={(subtitleFont) => setSettings((prev) => ({ ...prev, subtitleFont }))}
      />

      <GeneratingModal
        open={generatingModalOpen}
        settings={settings}
        onClose={() => {
          setGeneratingModalOpen(false);
          setCurrentView("projects");
        }}
        onFinishGeneration={handleFinishGeneration}
      />

      <VideoPlayerModal
        video={selectedVideo}
        onClose={() => {
          setSelectedVideo(null);
        }}
      />
    </div>
  );
}
