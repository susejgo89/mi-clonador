"use client";

import React, { useState } from "react";
import { Key, Check, Save, Sparkles, Image as ImageIcon, Volume2, ShieldCheck, Terminal } from "lucide-react";
import { AppApiKeys } from "@/types/kutly";

const STORAGE_KEYS_NAME = "kutly_custom_api_keys";

export function AccountView() {
  const [keys, setKeys] = useState<AppApiKeys>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS_NAME);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.warn("Could not load API keys from storage:", e);
      }
    }
    return {
      geminiKey: "",
      pexelsKey: "",
      pixabayKey: "",
      elevenLabsKey: "",
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEYS_NAME, JSON.stringify(keys));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn("Error saving keys:", err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAF7] flex items-center gap-2">
          <Key className="w-6 h-6 text-[#D9482E]" />
          <span>Configuración Local & API Keys</span>
        </h2>
        <p className="text-xs text-[#8C8985] mt-1">
          Gestiona tus claves de proveedores gratuitos y de pago para correr el estudio de video 100% autónomo.
        </p>
      </div>

      <form onSubmit={handleSaveKeys} className="space-y-6">
        {/* Gemini API Key */}
        <div className="p-6 rounded-2xl bg-[#151312] border border-white/6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#FAFAF7] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D9482E]" />
              <span>Google Gemini AI (Investigación & Guión Documental)</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold uppercase">
              Gratis en AI Studio
            </span>
          </div>

          <p className="text-xs text-[#8C8985] leading-relaxed">
            Se utiliza para investigar datos históricos, generar cronologías, fechas reales y narraciones de alta retención.
          </p>

          <div>
            <label className="text-xs text-[#8C8985] block mb-1.5 font-mono">GEMINI_API_KEY</label>
            <input
              type="password"
              value={keys.geminiKey}
              onChange={(e) => setKeys((prev) => ({ ...prev, geminiKey: e.target.value }))}
              placeholder="Pega tu clave (o déjalo vacío si ya está en .env.local)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#252320] border border-white/8 text-xs font-mono text-[#FAFAF7] placeholder-[#8C8985] focus:outline-none focus:border-[#D9482E]"
            />
          </div>
        </div>

        {/* Stock Image APIs (Pexels / Pixabay) */}
        <div className="p-6 rounded-2xl bg-[#151312] border border-white/6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#FAFAF7] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#FF7E5F]" />
              <span>Bancos de Imágenes y Video de Stock (Opcional)</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-mono font-bold uppercase">
              APIs Gratuitas
            </span>
          </div>

          <p className="text-xs text-[#8C8985] leading-relaxed">
            El sistema busca automáticamente en <strong>Wikipedia y Wikimedia (dominio público)</strong> y genera con <strong>IA (Pollinations Flux)</strong> sin costo. Si deseas añadir stock de Pexels o Pixabay, coloca tus claves gratuitas aquí:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#8C8985] block mb-1.5 font-mono">PEXELS_API_KEY</label>
              <input
                type="password"
                value={keys.pexelsKey}
                onChange={(e) => setKeys((prev) => ({ ...prev, pexelsKey: e.target.value }))}
                placeholder="Clave gratuita de Pexels API"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#252320] border border-white/8 text-xs font-mono text-[#FAFAF7] placeholder-[#8C8985] focus:outline-none focus:border-[#D9482E]"
              />
            </div>

            <div>
              <label className="text-xs text-[#8C8985] block mb-1.5 font-mono">PIXABAY_API_KEY</label>
              <input
                type="password"
                value={keys.pixabayKey}
                onChange={(e) => setKeys((prev) => ({ ...prev, pixabayKey: e.target.value }))}
                placeholder="Clave gratuita de Pixabay API"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#252320] border border-white/8 text-xs font-mono text-[#FAFAF7] placeholder-[#8C8985] focus:outline-none focus:border-[#D9482E]"
              />
            </div>
          </div>
        </div>

        {/* ElevenLabs API Key (Optional) */}
        <div className="p-6 rounded-2xl bg-[#151312] border border-white/6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#FAFAF7] flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#D9482E]" />
              <span>Voces Neuronales & TTS</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold uppercase">
              Edge-TTS Incluido (Gratis)
            </span>
          </div>

          <p className="text-xs text-[#8C8985] leading-relaxed">
            La app incluye de serie <strong>Edge Neural TTS (Voces humanas de Microsoft en Español neutro e Inglés) 100% gratis</strong>. Si tienes una cuenta de ElevenLabs, puedes introducir tu clave para habilitar clonación de voz:
          </p>

          <div>
            <label className="text-xs text-[#8C8985] block mb-1.5 font-mono">ELEVENLABS_API_KEY (Opcional)</label>
            <input
              type="password"
              value={keys.elevenLabsKey}
              onChange={(e) => setKeys((prev) => ({ ...prev, elevenLabsKey: e.target.value }))}
              placeholder="xi-api-key..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#252320] border border-white/8 text-xs font-mono text-[#FAFAF7] placeholder-[#8C8985] focus:outline-none focus:border-[#D9482E]"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#151312] border border-white/6">
          <div className="flex items-center gap-2 text-xs text-[#8C8985]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tus claves se almacenan de forma segura en tu navegador local.</span>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D9482E] to-[#FF7E5F] text-xs font-semibold text-white shadow-md shadow-[#D9482E]/25 hover:scale-[1.02] transition-transform cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4 stroke-[3]" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? "¡Guardado con Éxito!" : "Guardar Configuración"}</span>
          </button>
        </div>
      </form>

      {/* Docker & Local Deployment Guide */}
      <div className="p-6 rounded-2xl bg-[#151312] border border-white/6 space-y-3">
        <h3 className="text-sm font-semibold text-[#FAFAF7] flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#FF7E5F]" />
          <span>Ejecución en Docker / Servidor Propio</span>
        </h3>
        <p className="text-xs text-[#8C8985] leading-relaxed">
          Para ejecutar este clon en cualquier computadora o servidor sin instalar Node.js manualmente:
        </p>
        <div className="p-3.5 rounded-xl bg-[#1C1A18] border border-white/6 font-mono text-xs text-[#FAFAF7] space-y-1">
          <p className="text-[#8C8985]"># 1. Iniciar contenedor Docker en producción</p>
          <p className="text-emerald-400">docker compose up app --build</p>
          <p className="text-[#8C8985] pt-2"># 2. Acceder a la app en el puerto 3000</p>
          <p className="text-white">http://localhost:3000</p>
        </div>
      </div>
    </div>
  );
}
