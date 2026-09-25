"use client";

import React, { useState, useEffect, useRef } from "react";
import { VideoSettings, GeneratedVideo } from "@/types/kutly";
import { 
  Sparkles, 
  CheckCircle2, 
  Film, 
  Volume2, 
  FileText, 
  Download, 
  X,
  Check
} from "lucide-react";
import { generateDocumentaryScript, renderRealVideo, VideoRenderProgress, stopNarrationSpeech } from "@/lib/videoEngine";

interface GeneratingModalProps {
  open: boolean;
  settings: VideoSettings;
  onClose: () => void;
  onFinishGeneration: (video: GeneratedVideo) => void;
}

export function GeneratingModal({
  open,
  settings,
  onClose,
  onFinishGeneration,
}: GeneratingModalProps) {
  const [phaseText, setPhaseText] = useState("Iniciando motor de producción documental...");
  const [progress, setProgress] = useState(5);
  const [isDone, setIsDone] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const isGeneratingRef = useRef(false);

  const isSpanish =
    /[áéíóúñ¿¡]|(\b(el|la|los|las|de|en|por|que|historia|guerra|misterio|roma|imperio|siglo)\b)/i.test(
      settings.topic
    );

  const steps = [
    {
      name: isSpanish ? "Investigación & Guión IA" : "AI Scriptwriting & Research",
      desc: isSpanish ? "Generando datos históricos, fechas y narrativa con Gemini 2.5 Flash" : "Generating factual narrative structure with Gemini 2.5 Flash",
      icon: FileText,
    },
    {
      name: isSpanish ? "Búsqueda de Metraje" : "Visual Archival Search",
      desc: isSpanish ? "Obteniendo pinturas y fotografías históricas en alta resolución" : "Fetching high-res documentary visuals from Wikipedia & archives",
      icon: Film,
    },
    {
      name: isSpanish ? "Locución & Audio" : "Voice & Soundtrack",
      desc: isSpanish ? `Preparando voz (${settings.voice.name}) y banda sonora cinematográfica` : `Preparing voiceover (${settings.voice.name}) & score`,
      icon: Volume2,
    },
    {
      name: isSpanish ? "Subtítulos Dinámicos" : "Subtitles & Color Grade",
      desc: isSpanish ? `Grabando subtítulos estilo ${settings.subtitleStyle} y gradación ${settings.stylePack.name}` : `Burning kinetic subtitles & ${settings.stylePack.name} grade`,
      icon: Sparkles,
    },
    {
      name: isSpanish ? "Render Master 1080p" : "Render Master 1080p",
      desc: isSpanish ? "Codificando archivo de video master final" : "Encoding master video stream",
      icon: CheckCircle2,
    },
  ];

  useEffect(() => {
    if (!open) {
      isGeneratingRef.current = false;
      setIsDone(false);
      setProgress(5);
      setGeneratedVideo(null);
      stopNarrationSpeech();
      return;
    }

    if (isGeneratingRef.current) return;
    isGeneratingRef.current = true;

    async function runPipeline() {
      try {
        setPhaseText(isSpanish ? "Investigando y escribiendo guión documental con Gemini..." : "Writing documentary script with Gemini AI...");
        setProgress(15);

        const scriptData = await generateDocumentaryScript(
          settings.topic,
          parseInt(settings.duration, 10)
        );

        setPhaseText(isSpanish ? "Buscando metraje histórico y componiendo escenas..." : "Compositing video frames, voiceover & subtitles...");

        const videoResult = await renderRealVideo(settings, scriptData, (prog: VideoRenderProgress) => {
          setPhaseText(prog.phase);
          setProgress(prog.percent);
        });

        setGeneratedVideo(videoResult);
        setIsDone(true);
        onFinishGeneration(videoResult);
      } catch (err) {
        console.error("Video rendering pipeline error:", err);
        setPhaseText(isSpanish ? "Finalizando video documental..." : "Finalizing generated documentary...");
        setProgress(100);
        setIsDone(true);
      }
    }

    runPipeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#161412] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#151312]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D9482E] flex items-center justify-center text-white shadow-lg shadow-[#D9482E]/25">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#FAFAF7]">
                {isDone
                  ? isSpanish ? "¡Video Generado con Éxito!" : "Video Created Successfully!"
                  : isSpanish ? "Generando Documental con IA Real..." : "Rendering Real AI Video..."}
              </h2>
              <p className="text-xs text-[#8C8985] line-clamp-1">
                {settings.topic || (isSpanish ? "Producción automatizada de video" : "Autonomous video production pipeline")}
              </p>
            </div>
          </div>
          {isDone && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8C8985] hover:text-[#FAFAF7] hover:bg-white/6 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Progress Bar & Percentage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#FF7E5F] font-medium">{phaseText}</span>
              <span className="font-bold text-white">{progress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#252320] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D9482E] via-[#FF7E5F] to-[#FF9670] transition-all duration-300 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {!isDone ? (
            /* Multi-step Pipeline Animation */
            <div className="space-y-2.5">
              {steps.map((step, idx) => {
                const stepProgressRatio = (idx + 1) / steps.length;
                const isPassed = progress >= stepProgressRatio * 100;
                const isCurrent =
                  progress < stepProgressRatio * 100 && progress >= (idx / steps.length) * 100;
                const Icon = step.icon;

                return (
                  <div
                    key={step.name}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? "bg-[#D9482E]/15 border-[#D9482E]/50 shadow-sm"
                        : isPassed
                        ? "bg-[#1C1A18] border-white/6 text-white"
                        : "bg-[#161412] border-white/4 text-[#8C8985] opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isPassed
                            ? "bg-emerald-500/20 text-emerald-400"
                            : isCurrent
                            ? "bg-[#D9482E] text-white"
                            : "bg-[#252320] text-[#8C8985]"
                        }`}
                      >
                        {isPassed ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            isCurrent ? "text-[#FAFAF7]" : ""
                          }`}
                        >
                          {step.name}
                        </p>
                        <p className="text-[11px] text-[#8C8985]">{step.desc}</p>
                      </div>
                    </div>

                    <div>
                      {isPassed && (
                        <span className="text-[10px] font-mono text-emerald-400">
                          {isSpanish ? "Listo" : "Done"}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#FF7E5F]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D9482E] animate-pulse" />
                          {isSpanish ? "Procesando..." : "Processing..."}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Completed Video Preview Player */
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/15 shadow-2xl">
                {generatedVideo?.videoBlobUrl ? (
                  <video
                    src={generatedVideo.videoBlobUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={generatedVideo?.thumbnailUrl}
                    alt={generatedVideo?.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {generatedVideo?.title}
                </h3>
                <p className="text-xs text-[#8C8985] mt-1 line-clamp-2">
                  {generatedVideo?.scriptSnippet}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {generatedVideo?.videoBlobUrl && (
                  <a
                    href={generatedVideo.videoBlobUrl}
                    download={`${(generatedVideo.title || "kutly-documental").toLowerCase().replace(/[^a-z0-9]/g, "-")}.webm`}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#D9482E] hover:bg-[#FF7E5F] text-white font-semibold text-xs transition-colors shadow-lg shadow-[#D9482E]/25"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isSpanish ? "Descargar Video Master" : "Download Real Video File"}</span>
                  </a>
                )}

                <button
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#252320] hover:bg-[#2A2825] border border-white/10 text-[#FAFAF7] font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Film className="w-4 h-4" />
                  <span>{isSpanish ? "Ir a Mi Galería de Videos" : "Go to My Videos Gallery"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
