"use client";

import React, { useState } from "react";
import { GeneratedVideo } from "@/types/kutly";
import { 
  X, 
  Download, 
  Tag
} from "lucide-react";
import { YouTubeIcon } from "@/components/icons";

interface VideoPlayerModalProps {
  video: GeneratedVideo | null;
  onClose: () => void;
}

export function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  const [activeTab, setActiveTab] = useState<"script" | "chapters" | "seo">("script");

  if (!video) return null;

  const chapters = [
    { time: "00:00", title: "Introduction: The Hidden Strategic Chokepoint" },
    { time: "03:45", title: "Chapter 1: The Geography of Maritime Bottlenecks" },
    { time: "08:12", title: "Chapter 2: The Malacca Dilemma Explained" },
    { time: "14:30", title: "Chapter 3: Alternative Pipelines & Canal Megaprojects" },
    { time: "18:20", title: "Conclusion: The Geopolitical Balance of Power" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#161412] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#151312]">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500 text-black">
              1080P 60FPS
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#FAFAF7] truncate max-w-lg">
              {video.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C8985] hover:text-[#FAFAF7] hover:bg-white/6 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body (Split into Player and Details/Script) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
          {/* Left / Top: Video Player */}
          <div className="lg:col-span-2 p-6 flex flex-col justify-between bg-black/50 border-b lg:border-b-0 lg:border-r border-white/8 space-y-4">
            {/* Player Viewport */}
            <div className="relative w-full aspect-video rounded-xl bg-black overflow-hidden border border-white/10 shadow-2xl group flex items-center justify-center">
              {video.videoBlobUrl ? (
                <video
                  src={video.videoBlobUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute bottom-12 px-6 text-center">
                    <p className="font-bebas text-xl sm:text-2xl text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      <span className="text-[#FF7E5F]">THE STRAIT OF MALACCA</span> IS THE SINGLE MOST IMPORTANT STRETCH OF WATER ON EARTH
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              {video.videoBlobUrl ? (
                <a
                  href={video.videoBlobUrl}
                  download={`${(video.title || "video").toLowerCase().replace(/[^a-z0-9]/g, "-")}.webm`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D9482E] hover:bg-[#FF7E5F] text-white text-xs font-semibold transition-colors shadow-md shadow-[#D9482E]/25"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Video File</span>
                </a>
              ) : (
                <button
                  onClick={() => alert("Downloading video...")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D9482E] hover:bg-[#FF7E5F] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP4</span>
                </button>
              )}

              <button
                onClick={() => alert("Publishing to Connected YouTube Channel...")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#252320] hover:bg-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <YouTubeIcon className="w-4 h-4 text-red-500" />
                <span>Publish to YouTube</span>
              </button>
            </div>
          </div>

          {/* Right / Bottom: Tabs (Script / Chapters / SEO) */}
          <div className="p-6 flex flex-col justify-between bg-[#151312] space-y-4">
            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#252320] border border-white/6 text-xs">
              {(["script", "chapters", "seo"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-1.5 rounded-lg capitalize transition-colors font-medium ${
                    activeTab === t
                      ? "bg-[#151312] text-white shadow-sm border border-white/8"
                      : "text-[#8C8985] hover:text-[#FAFAF7]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto max-h-72 space-y-3 pr-1 text-xs">
              {activeTab === "script" && (
                <div className="space-y-3 leading-relaxed text-[#A3A09A]">
                  <p className="text-[#FAFAF7] font-semibold">Documentary Narrative Script</p>
                  <p>{video.scriptSnippet}</p>
                  {video.scenes && video.scenes.map((sc, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[#1C1A18] border border-white/6 space-y-1">
                      <span className="text-[#FF7E5F] font-mono text-[10px]">Scene {i + 1} ({sc.durationSeconds}s)</span>
                      <p className="text-white text-[11px]">{sc.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "chapters" && (
                <div className="space-y-2">
                  {chapters.map((ch, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#1C1A18] hover:bg-[#252320] transition-colors cursor-pointer"
                    >
                      <span className="text-[#FAFAF7] font-medium">{ch.title}</span>
                      <span className="font-mono text-[#FF7E5F] font-bold text-[11px] ml-2 shrink-0">
                        {ch.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "seo" && (
                <div className="space-y-3">
                  <div>
                    <span className="text-[#8C8985] block mb-1">Optimized YouTube Title</span>
                    <p className="p-2.5 rounded-xl bg-[#1C1A18] font-semibold text-[#FAFAF7]">
                      {video.title}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#8C8985] block mb-1">High-CTR Search Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {video.seoTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-lg bg-[#252320] text-[#FAFAF7] text-[11px] font-mono flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3 text-[#D9482E]" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
