"use client";

import React, { useState, useEffect } from "react";
import { GeneratedVideo } from "@/types/kutly";
import { 
  X, 
  Download, 
  Tag,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Play
} from "lucide-react";
import { YouTubeIcon } from "@/components/icons";
import { speakNarrationText, stopNarrationSpeech } from "@/lib/videoEngine";

interface VideoPlayerModalProps {
  video: GeneratedVideo | null;
  onClose: () => void;
}

export function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  const [activeTab, setActiveTab] = useState<"script" | "chapters" | "seo">("script");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [activeSpeakingScene, setActiveSpeakingScene] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      stopNarrationSpeech();
    };
  }, []);

  if (!video) return null;

  const isSpanish =
    /[áéíóúñ¿¡]/i.test(video.title) ||
    /[áéíóúñ¿¡]/i.test(video.scriptSnippet) ||
    video.voiceName.toLowerCase().includes("español");

  const handleToggleFullNarration = async () => {
    if (isSpeaking) {
      stopNarrationSpeech();
      setIsSpeaking(false);
      setActiveSpeakingScene(null);
      return;
    }

    const fullScript = (video.scenes && video.scenes.length > 0)
      ? video.scenes.map((s) => s.text).join(". ")
      : video.scriptSnippet;

    setIsSpeaking(true);
    await speakNarrationText(
      fullScript,
      isSpanish,
      "male",
      () => {
        setIsSpeaking(false);
        setActiveSpeakingScene(null);
      }
    );
  };

  const handleSpeakScene = async (sceneText: string, sceneId: number) => {
    if (activeSpeakingScene === sceneId) {
      stopNarrationSpeech();
      setActiveSpeakingScene(null);
      setIsSpeaking(false);
      return;
    }

    setActiveSpeakingScene(sceneId);
    setIsSpeaking(true);
    await speakNarrationText(
      sceneText,
      isSpanish,
      "male",
      () => {
        setActiveSpeakingScene(null);
        setIsSpeaking(false);
      }
    );
  };

  const handleCopyTitle = () => {
    if (video.title) {
      navigator.clipboard.writeText(video.title);
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    }
  };

  const chapters = [
    { time: "00:00", title: `Introducción: El enigma de ${video.topic || video.title}` },
    { time: "03:15", title: "Capítulo 1: Antecedentes históricos y causas profundas" },
    { time: "07:45", title: "Capítulo 2: El punto de quiebre y las decisiones clave" },
    { time: "12:20", title: "Capítulo 3: Impacto global y consecuencias estratégicas" },
    { time: "16:00", title: "Conclusión: Lecciones y legado en el mundo actual" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#161412] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-[#151312]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500 text-black shrink-0">
              1080P 60FPS
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#FAFAF7] truncate">
              {video.title}
            </h2>
          </div>
          <button
            onClick={() => {
              stopNarrationSpeech();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#8C8985] hover:text-[#FAFAF7] hover:bg-white/6 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body (Split into Player and Details/Script) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
          {/* Left / Top: Video Player */}
          <div className="lg:col-span-2 p-5 flex flex-col justify-between bg-black/50 border-b lg:border-b-0 lg:border-r border-white/8 space-y-4">
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
                <div className="relative w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-6">
                    <p className="text-white text-sm sm:text-base font-semibold drop-shadow-md">
                      {video.title}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions & Speech Narration Control */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Voice Narration Button */}
              <button
                onClick={handleToggleFullNarration}
                className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer ${
                  isSpeaking
                    ? "bg-amber-500 hover:bg-amber-600 text-black animate-pulse"
                    : "bg-[#252320] hover:bg-[#2F2C28] text-white border border-white/10"
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FF7E5F]" />}
                <span>{isSpeaking ? "Detener Locución de Voz" : "🔊 Escuchar Voz IA (Español)"}</span>
              </button>

              {video.videoBlobUrl ? (
                <a
                  href={video.videoBlobUrl}
                  download={`${(video.title || "kutly-documental").toLowerCase().replace(/[^a-z0-9]/g, "-")}.webm`}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D9482E] hover:bg-[#FF7E5F] text-white text-xs font-semibold transition-colors shadow-md shadow-[#D9482E]/25"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Video Master</span>
                </a>
              ) : (
                <button
                  onClick={() => alert("El archivo de video generado está listo para visualizarse.")}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D9482E] hover:bg-[#FF7E5F] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar 1080p</span>
                </button>
              )}

              <button
                onClick={() => alert("Canal de YouTube conectado: listo para sincronizar y publicar.")}
                className="p-2.5 rounded-xl bg-[#252320] hover:bg-white/10 text-white transition-colors cursor-pointer"
                title="Publicar en YouTube"
              >
                <YouTubeIcon className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>

          {/* Right / Bottom: Tabs (Script / Chapters / SEO) */}
          <div className="p-5 flex flex-col justify-between bg-[#151312] space-y-4">
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
                  {t === "script" ? "Guión" : t === "chapters" ? "Capítulos" : "SEO"}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto max-h-80 space-y-3 pr-1 text-xs">
              {activeTab === "script" && (
                <div className="space-y-3 leading-relaxed text-[#A3A09A]">
                  <div className="p-3 rounded-xl bg-[#1C1A18] border border-white/6 space-y-1.5">
                    <p className="text-[#FAFAF7] font-semibold text-xs">Tesis Central / Resumen</p>
                    <p className="text-[#C5C2BC] text-[11px] leading-relaxed">{video.scriptSnippet}</p>
                  </div>

                  {video.scenes && video.scenes.length > 0 ? (
                    video.scenes.map((sc, i) => (
                      <div
                        key={sc.id || i}
                        className={`p-3 rounded-xl border transition-colors space-y-2 ${
                          activeSpeakingScene === (sc.id || i + 1)
                            ? "bg-[#D9482E]/15 border-[#D9482E]/50"
                            : "bg-[#1C1A18] border-white/6"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[#FF7E5F] font-mono text-[10px] font-bold uppercase">
                            Escena {i + 1} ({sc.durationSeconds || 6}s)
                          </span>
                          <button
                            onClick={() => handleSpeakScene(sc.text, sc.id || i + 1)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#252320] hover:bg-[#D9482E] text-white text-[10px] font-medium transition-colors"
                          >
                            {activeSpeakingScene === (sc.id || i + 1) ? (
                              <>
                                <VolumeX className="w-3 h-3" />
                                <span>Pausar</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3" />
                                <span>Escuchar</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-white text-[11px] leading-relaxed">{sc.text}</p>
                        {sc.visualKeyword && (
                          <p className="text-[10px] text-[#8C8985] font-mono">
                            🖼️ Archivo: {sc.visualKeyword}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-xl bg-[#1C1A18] text-[#8C8985] text-center">
                      Guión narrativo generado con IA
                    </div>
                  )}
                </div>
              )}

              {activeTab === "chapters" && (
                <div className="space-y-2">
                  {chapters.map((ch, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#1C1A18] hover:bg-[#252320] transition-colors cursor-pointer"
                    >
                      <span className="text-[#FAFAF7] font-medium text-[11px]">{ch.title}</span>
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
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#8C8985] text-[11px]">Título Optimizado para YouTube</span>
                      <button
                        onClick={handleCopyTitle}
                        className="text-[10px] text-[#FF7E5F] flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        {copiedTitle ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedTitle ? "Copiado" : "Copiar"}
                      </button>
                    </div>
                    <p className="p-2.5 rounded-xl bg-[#1C1A18] font-semibold text-[#FAFAF7] text-[11px] border border-white/6">
                      {video.title}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#8C8985] block mb-1 text-[11px]">Etiquetas de Búsqueda (High CTR)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {video.seoTags && video.seoTags.length > 0 ? (
                        video.seoTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-lg bg-[#252320] text-[#FAFAF7] text-[10px] font-mono flex items-center gap-1 border border-white/4"
                          >
                            <Tag className="w-3 h-3 text-[#D9482E]" />
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#8C8985] text-[11px]">Etiquetas automáticas listas</span>
                      )}
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
