"use client";

import React, { useState } from "react";
import { GeneratedVideo } from "@/types/kutly";
import { 
  Search, 
  Play, 
  Download, 
  Volume2, 
  Plus
} from "lucide-react";
import { YouTubeIcon } from "@/components/icons";

interface ProjectsViewProps {
  videos: GeneratedVideo[];
  onOpenStudio: () => void;
  onSelectVideo: (video: GeneratedVideo) => void;
}

export function ProjectsView({
  videos,
  onOpenStudio,
  onSelectVideo,
}: ProjectsViewProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "ready" | "processing">("all");

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.topic.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || v.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#FAFAF7]">Generated Videos</h2>
          <p className="text-xs text-[#8C8985] mt-0.5">
            Manage, review scripts, download in 1080p, and push to your YouTube channels
          </p>
        </div>

        <button
          onClick={onOpenStudio}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D9482E] to-[#FF7E5F] text-xs font-semibold text-white shadow-md shadow-[#D9482E]/20 hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Video</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#151312] border border-white/6">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#252320] text-xs">
          {(["all", "ready", "processing"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors font-medium ${
                filter === tab
                  ? "bg-[#151312] text-white shadow-sm border border-white/8"
                  : "text-[#8C8985] hover:text-[#FAFAF7]"
              }`}
            >
              {tab === "all" ? `All (${videos.length})` : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8985]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#252320] border border-white/8 text-xs text-[#FAFAF7] placeholder-[#8C8985] focus:outline-none focus:border-[#D9482E]/60"
          />
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => onSelectVideo(video)}
            className="group relative rounded-2xl bg-[#151312] border border-white/6 hover:border-[#D9482E]/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#D9482E]/10 cursor-pointer"
          >
            {/* Thumbnail Poster */}
            <div className="relative w-full aspect-video bg-black overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Play Overlay Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                <div className="w-12 h-12 rounded-full bg-[#D9482E] text-white flex items-center justify-center shadow-lg shadow-[#D9482E]/50 group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 ml-0.5" />
                </div>
              </div>

              {/* Duration Badge */}
              <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/80 text-white border border-white/10 backdrop-blur-sm">
                {video.durationFormatted}
              </span>

              {/* Status Badge */}
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500 text-black">
                Ready
              </span>
            </div>

            {/* Video Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-semibold text-sm text-[#FAFAF7] group-hover:text-[#FF7E5F] transition-colors line-clamp-2 leading-snug">
                  {video.title}
                </h3>
                <p className="text-xs text-[#8C8985] line-clamp-2 mt-1.5 leading-relaxed">
                  {video.scriptSnippet}
                </p>
              </div>

              {/* Meta Tags */}
              <div className="space-y-3 pt-2 border-t border-white/6">
                <div className="flex items-center justify-between text-[11px] text-[#8C8985] font-mono">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-[#FF7E5F]" />
                    {video.voiceName}
                  </span>
                  <span>{video.createdAt}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Downloading 1080p MP4 file...");
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#252320] hover:bg-white/10 text-xs font-medium text-[#FAFAF7] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download 1080p</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Connecting to YouTube Publishing Channel...");
                    }}
                    className="p-2 rounded-xl bg-[#252320] hover:bg-[#D9482E] text-white transition-colors"
                    title="Publish to YouTube"
                  >
                    <YouTubeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
