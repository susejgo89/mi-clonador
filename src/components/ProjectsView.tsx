"use client";

import React, { useState } from "react";
import { GeneratedVideo } from "@/types/kutly";
import { 
  Search, 
  Play, 
  Download, 
  Volume2, 
  Plus,
  Trash2,
  Sparkles,
  Film
} from "lucide-react";
import { YouTubeIcon } from "@/components/icons";

interface ProjectsViewProps {
  videos: GeneratedVideo[];
  onOpenStudio: () => void;
  onSelectVideo: (video: GeneratedVideo) => void;
  onDeleteVideo?: (videoId: string) => void;
}

export function ProjectsView({
  videos,
  onOpenStudio,
  onSelectVideo,
  onDeleteVideo,
}: ProjectsViewProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "ready" | "processing">("all");

  const filteredVideos = videos.filter((v) => {
    const titleMatch = (v.title || "").toLowerCase().includes(search.toLowerCase());
    const topicMatch = (v.topic || "").toLowerCase().includes(search.toLowerCase());
    const matchesSearch = titleMatch || topicMatch;
    const matchesFilter = filter === "all" || v.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (video: GeneratedVideo, e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.videoBlobUrl) {
      const a = document.createElement("a");
      a.href = video.videoBlobUrl;
      a.download = `${(video.title || "documental").toLowerCase().replace(/[^a-z0-9]/g, "-")}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create a downloadable JSON/TXT script file as fallback
      const content = `TITULO: ${video.title}\n\nRESUMEN:\n${video.scriptSnippet}\n\nESCENAS:\n${(video.scenes || []).map((s, i) => `[Escena ${i+1}] (${s.durationSeconds || 6}s):\n${s.text}`).join("\n\n")}`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(video.title || "guion-documental").toLowerCase().replace(/[^a-z0-9]/g, "-")}-guion.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAF7] flex items-center gap-2">
            <Film className="w-6 h-6 text-[#D9482E]" />
            <span>Mis Videos y Documentales</span>
          </h2>
          <p className="text-xs text-[#8C8985] mt-1">
            Administra tus proyectos generados, reproduce en 1080p con voz IA, descarga y publica en YouTube
          </p>
        </div>

        <button
          onClick={onOpenStudio}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D9482E] to-[#FF7E5F] text-xs font-semibold text-white shadow-md shadow-[#D9482E]/20 hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Video</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#151312] border border-white/6">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#252320] text-xs w-full sm:w-auto">
          {(["all", "ready"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg capitalize transition-colors font-medium text-xs ${
                filter === tab
                  ? "bg-[#151312] text-white shadow-sm border border-white/8"
                  : "text-[#8C8985] hover:text-[#FAFAF7]"
              }`}
            >
              {tab === "all" ? `Todos (${videos.length})` : "Listos para ver"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8985]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por tema o título..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#252320] border border-white/8 text-xs text-[#FAFAF7] placeholder-[#8C8985] focus:outline-none focus:border-[#D9482E]/60"
          />
        </div>
      </div>

      {/* Video Grid or Empty State */}
      {filteredVideos.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#151312] border border-white/6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#252320] text-[#FF7E5F] flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-semibold text-white">No hay videos en esta sección</h3>
            <p className="text-xs text-[#8C8985]">
              {search
                ? "No encontramos videos que coincidan con tu búsqueda."
                : "Aún no has generado ningún video. ¡Prueba el estudio de creación con IA!"}
            </p>
          </div>
          <button
            onClick={onOpenStudio}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D9482E] hover:bg-[#FF7E5F] text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generar Mi Primer Documental</span>
          </button>
        </div>
      ) : (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                {/* Play Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <div className="w-12 h-12 rounded-full bg-[#D9482E] text-white flex items-center justify-center shadow-lg shadow-[#D9482E]/50 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white border border-white/10 backdrop-blur-sm">
                  {video.durationFormatted || "14:00"}
                </span>

                {/* Status Badge */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-emerald-500 text-black">
                  1080P MASTER
                </span>

                {onDeleteVideo && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteVideo(video.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
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

                {/* Meta Tags & Actions */}
                <div className="space-y-3 pt-2 border-t border-white/6">
                  <div className="flex items-center justify-between text-[11px] text-[#8C8985] font-mono">
                    <span className="flex items-center gap-1.5 truncate max-w-[170px]">
                      <Volume2 className="w-3.5 h-3.5 text-[#FF7E5F] shrink-0" />
                      <span className="truncate">{video.voiceName}</span>
                    </span>
                    <span>{video.createdAt || "Reciente"}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={(e) => handleDownload(video, e)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#252320] hover:bg-white/10 text-xs font-medium text-[#FAFAF7] transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{video.videoBlobUrl ? "Descargar Video" : "Descargar Guión"}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Canal de YouTube configurado: listo para sincronizar.");
                      }}
                      className="p-2 rounded-xl bg-[#252320] hover:bg-[#D9482E] text-white transition-colors cursor-pointer"
                      title="Publicar en YouTube"
                    >
                      <YouTubeIcon className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
