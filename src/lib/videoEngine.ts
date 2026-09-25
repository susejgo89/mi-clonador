import { VideoSettings, VideoScene, GeneratedVideo } from "@/types/kutly";

export interface VideoRenderProgress {
  phase: string;
  percent: number;
  currentFrame: number;
  totalFrames: number;
}

export interface ScriptResponse {
  title: string;
  summary: string;
  language?: "es" | "en";
  scenes: VideoScene[];
  seoTags: string[];
}

/**
 * Wait and fetch available SpeechSynthesis voices properly (handles async loading in Chromium/Firefox)
 */
export async function getLoadedSpeechVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }

  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    return voices;
  }

  return new Promise((resolve) => {
    let resolved = false;
    const finish = () => {
      if (!resolved) {
        resolved = true;
        resolve(window.speechSynthesis.getVoices() || []);
      }
    };

    window.speechSynthesis.addEventListener("voiceschanged", finish, { once: true });
    setTimeout(finish, 700);
  });
}

/**
 * Select the most natural voice matching language and gender
 */
export async function getBestSpeechVoice(
  isSpanish: boolean,
  gender: "male" | "female" = "male"
): Promise<SpeechSynthesisVoice | null> {
  const voices = await getLoadedSpeechVoices();
  if (!voices || voices.length === 0) return null;

  if (isSpanish) {
    const spanishVoices = voices.filter((v) => {
      const code = (v.lang || "").toLowerCase().replace("_", "-");
      return (
        code.startsWith("es") ||
        v.name.toLowerCase().includes("spanish") ||
        v.name.toLowerCase().includes("español")
      );
    });

    if (spanishVoices.length > 0) {
      // Find gender match or high-quality voice
      const preferred = spanishVoices.find((v) => {
        const name = v.name.toLowerCase();
        const isFemale = /female|mujer|paulina|monica|helena|sabina|lucia|sofia|maria|laura|elena/i.test(name);
        const isMale = /male|hombre|jorge|diego|alvaro|pablo|enrique|carlos|miguel|manuel/i.test(name);
        if (gender === "female" && isFemale) return true;
        if (gender === "male" && isMale) return true;
        return /google|natural|premium|online|neural/i.test(name);
      });
      return preferred || spanishVoices[0];
    }
  } else {
    const englishVoices = voices.filter((v) => {
      const code = (v.lang || "").toLowerCase().replace("_", "-");
      return code.startsWith("en") || v.name.toLowerCase().includes("english");
    });

    if (englishVoices.length > 0) {
      const preferred = englishVoices.find((v) => {
        const name = v.name.toLowerCase();
        const isFemale = /female|woman|samantha|victoria|zira|jenny|ava|olivia/i.test(name);
        const isMale = /male|man|guy|david|george|mark|guy|ryan/i.test(name);
        if (gender === "female" && isFemale) return true;
        if (gender === "male" && isMale) return true;
        return /google|natural|premium|online|neural/i.test(name);
      });
      return preferred || englishVoices[0];
    }
  }

  return voices[0] || null;
}

/**
 * Play synchronized speech narration for a given text in natural voice
 */
export async function speakNarrationText(
  text: string,
  isSpanish: boolean,
  gender: "male" | "female" = "male",
  onEnd?: () => void
): Promise<SpeechSynthesisUtterance | null> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  window.speechSynthesis.cancel(); // Stop any active speech

  const cleanText = text.trim();
  if (!cleanText) return null;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const voice = await getBestSpeechVoice(isSpanish, gender);

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || (isSpanish ? "es-ES" : "en-US");
  } else {
    utterance.lang = isSpanish ? "es-ES" : "en-US";
  }

  utterance.rate = 0.96;
  utterance.pitch = gender === "female" ? 1.05 : 0.95;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Stop any active browser speech synthesis
 */
export function stopNarrationSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Fetch dynamic high-resolution thematic images (via Wikipedia / Wikimedia APIs)
 */
async function fetchThematicVisual(keyword: string, fallbackUrl: string): Promise<string> {
  try {
    const cleanKw = keyword.replace(/[^\w\s\u00C0-\u017F]/gi, " ").trim();
    if (!cleanKw) return fallbackUrl;

    // Try Spanish Wikipedia first, then English Wikipedia
    const searchLanguages = ["es", "en"];

    for (const lang of searchLanguages) {
      const endpoint = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(
        cleanKw
      )}&gsrlimit=4&prop=pageimages&pithumbsize=1280&origin=*`;

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        const pages = data?.query?.pages;
        if (pages) {
          for (const pageId in pages) {
            const thumbnail = pages[pageId]?.thumbnail?.source;
            if (thumbnail && typeof thumbnail === "string" && thumbnail.startsWith("http")) {
              return thumbnail;
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn("Wikipedia visual search fallback:", err);
  }

  return fallbackUrl;
}

export async function generateDocumentaryScript(
  topic: string,
  durationMinutes: number
): Promise<ScriptResponse> {
  try {
    const res = await fetch("/api/generate-script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, durationMinutes }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.scenes) && data.scenes.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("API script fetch failed, using fallback:", err);
  }

  const isSpanish = /[áéíóúñ¿¡]|(\b(el|la|los|las|de|en|por|que|historia|guerra|misterio|roma|imperio|siglo)\b)/i.test(
    topic
  );

  const cleanTopic = topic.trim() || (isSpanish ? "Grandes Enigmas de la Historia" : "Great Mysteries of History");

  return {
    title: isSpanish ? `La Verdad Oculta de ${cleanTopic}` : `The Untold Story of ${cleanTopic}`,
    summary: isSpanish
      ? `Una profunda investigación documental que desvela los secretos, giros estratégicos y consecuencias históricas de ${cleanTopic}.`
      : `An in-depth documentary investigation exploring the strategic decisions and historical turning points of ${cleanTopic}.`,
    language: isSpanish ? "es" : "en",
    seoTags: [cleanTopic.toLowerCase(), "documental", "historia explicada", "investigacion", "curiosidades"],
    scenes: [
      {
        id: 1,
        text: isSpanish
          ? `A lo largo de los siglos, pocos acontecimientos han tenido un impacto tan determinante como ${cleanTopic}.`
          : `Throughout modern history, few events have carried such profound significance as ${cleanTopic}.`,
        visualKeyword: `${cleanTopic} historia documental`,
        durationSeconds: 6,
      },
      {
        id: 2,
        text: isSpanish
          ? "Bajo la superficie de la narrativa oficial, existe un complejo entramado de intereses geopolíticos, económicos y estratégicos."
          : "Beneath the surface lies a complex web of geopolitical stakes, strategic maneuvers, and immense economic power.",
        visualKeyword: `${cleanTopic} archivos mapas antiguos`,
        durationSeconds: 6,
      },
      {
        id: 3,
        text: isSpanish
          ? "Cuando los historiadores analizan los documentos y datos originales, se revela un momento crítico que cambió el destino de su época."
          : "When historians examine the original archives, the data reveals a critical turning point that altered modern history.",
        visualKeyword: `${cleanTopic} investigacion batalla`,
        durationSeconds: 6,
      },
      {
        id: 4,
        text: isSpanish
          ? "Las repercusiones de estos hechos transformaron las estructuras de poder y sentaron las bases del mundo contemporáneo."
          : "The structural consequences reverberated across global trade, technology, and international relations.",
        visualKeyword: `${cleanTopic} consecuencias impacto global`,
        durationSeconds: 6,
      },
      {
        id: 5,
        text: isSpanish
          ? "Hoy en día, las lecciones aprendidas de esta historia continúan influyendo de manera directa en nuestra sociedad."
          : "Today, the enduring lessons learned here remain more relevant than ever before.",
        visualKeyword: `${cleanTopic} legado horizonte cine`,
        durationSeconds: 6,
      },
    ],
  };
}

/**
 * Creates a real client-side synthesized video using Canvas 2D + Web Audio + MediaRecorder
 */
export async function renderRealVideo(
  settings: VideoSettings,
  scriptData: ScriptResponse,
  onProgress: (prog: VideoRenderProgress) => void
): Promise<GeneratedVideo> {
  const width = 1280;
  const height = 720;
  const fps = 30;

  const isSpanish =
    scriptData.language === "es" ||
    /[áéíóúñ¿¡]/i.test(scriptData.scenes[0]?.text || "") ||
    /[áéíóúñ¿¡]/i.test(scriptData.title || "");

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get 2D canvas context");
  }

  // Preload visual images dynamically for each scene from Wikipedia
  onProgress({
    phase: isSpanish ? "Buscando metraje e imágenes históricas con IA..." : "Searching thematic archival footage with AI...",
    percent: 20,
    currentFrame: 0,
    totalFrames: 100,
  });

  const loadedImages: HTMLImageElement[] = [];

  for (let i = 0; i < scriptData.scenes.length; i++) {
    const scene = scriptData.scenes[i];
    const visualUrl = await fetchThematicVisual(
      scene.visualKeyword || settings.topic,
      settings.stylePack.previewUrl
    );

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = visualUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = () => {
        // Fallback image if CORS issue
        img.src = settings.stylePack.previewUrl;
        resolve(null);
      };
    });
    loadedImages.push(img);
  }

  // Setup Web Audio synthesis for soundtrack
  onProgress({
    phase: isSpanish ? "Sintetizando banda sonora cinematográfica..." : "Synthesizing cinematic audio score...",
    percent: 40,
    currentFrame: 0,
    totalFrames: 100,
  });

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioContext = new AudioCtx();
  const dest = audioContext.createMediaStreamDestination();

  // Create atmospheric cinematic soundscape
  const osc1 = audioContext.createOscillator();
  const osc2 = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();

  osc1.type = "sine";
  osc1.frequency.setValueAtTime(110, audioContext.currentTime); // A2 note
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(164.81, audioContext.currentTime); // E3 note

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(450, audioContext.currentTime);
  gain.gain.setValueAtTime(0.06, audioContext.currentTime);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  osc1.start();
  osc2.start();

  // Setup MediaRecorder
  const canvasStream = canvas.captureStream(fps);
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
    ? "video/webm;codecs=vp9,opus"
    : MediaRecorder.isTypeSupported("video/webm")
    ? "video/webm"
    : "video/mp4";

  const recorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: 3_500_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.start(100);

  // Calculate rendering time: 6s per scene, capped at 24s for snappy client-side render
  const totalSceneSeconds = scriptData.scenes.reduce((acc, s) => acc + (s.durationSeconds || 6), 0);
  const totalFrames = fps * Math.min(24, Math.max(12, totalSceneSeconds));

  let frameCount = 0;

  await new Promise<void>((resolve) => {
    const renderLoop = () => {
      frameCount++;
      const currentSeconds = frameCount / fps;
      const progressPercent = Math.min(95, 40 + Math.round((frameCount / totalFrames) * 55));

      onProgress({
        phase: isSpanish
          ? `Componiendo escenas y subtítulos con IA (${frameCount}/${totalFrames} fotogramas)...`
          : `Compositing scenes & kinetic subtitles (${frameCount}/${totalFrames} frames)...`,
        percent: progressPercent,
        currentFrame: frameCount,
        totalFrames,
      });

      // Determine active scene
      let elapsed = 0;
      let activeSceneIndex = 0;
      for (let i = 0; i < scriptData.scenes.length; i++) {
        const dur = scriptData.scenes[i].durationSeconds || 6;
        if (currentSeconds >= elapsed && currentSeconds < elapsed + dur) {
          activeSceneIndex = i;
          break;
        }
        elapsed += dur;
      }

      const activeScene = scriptData.scenes[activeSceneIndex] || scriptData.scenes[0];
      const activeImg = loadedImages[activeSceneIndex] || loadedImages[0];

      // Draw background visual with Ken Burns slow cinematic zoom
      ctx.fillStyle = "#0E0C0B";
      ctx.fillRect(0, 0, width, height);

      if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
        const zoom = 1 + (frameCount % (fps * 6)) * 0.0018;
        const drawW = width * zoom;
        const drawH = height * zoom;
        const drawX = (width - drawW) / 2;
        const drawY = (height - drawH) / 2;
        ctx.drawImage(activeImg, drawX, drawY, drawW, drawH);
      }

      // Apply Style Pack color grading
      if (settings.stylePack.id === "noir") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, width, height);
      } else if (settings.stylePack.id === "velvet") {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, "rgba(217, 72, 46, 0.18)");
        grad.addColorStop(0.5, "rgba(14, 12, 11, 0.35)");
        grad.addColorStop(1, "rgba(14, 12, 11, 0.9)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (settings.stylePack.id === "cinematic") {
        // Anamorphic 35mm letterbox
        ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
        ctx.fillRect(0, 0, width, 55);
        ctx.fillRect(0, height - 55, width, 55);
      }

      // Draw burned-in kinetic subtitles
      if (settings.subtitlesOn && activeScene) {
        const words = activeScene.text.split(" ");
        const wordsPerSec = Math.max(1, words.length / (activeScene.durationSeconds || 6));
        const sceneLocalSec = Math.max(0, currentSeconds - elapsed);
        const activeWordIdx = Math.min(words.length - 1, Math.floor(sceneLocalSec * wordsPerSec));

        // Subtitle card backdrop
        ctx.fillStyle = "rgba(14, 12, 11, 0.88)";
        ctx.roundRect(80, height - 140, width - 160, 85, 16);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = "bold 23px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textY = height - 98;
        const totalText = activeScene.text;

        // Render full subtitle line
        ctx.fillStyle = "#FAFAF7";
        ctx.fillText(totalText, width / 2, textY, width - 200);

        // Highlight active word in orange pill
        if (words[activeWordIdx]) {
          ctx.fillStyle = "#FF7E5F";
          ctx.font = "bold 17px sans-serif";
          ctx.fillText(`▶ ${words[activeWordIdx]}`, width / 2, height - 155);
        }
      }

      // Watermark
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = "11px monospace";
      ctx.textAlign = "right";
      ctx.fillText("KUTLY AI DOCUMENTARY STUDIO", width - 35, 35);

      if (frameCount < totalFrames) {
        requestAnimationFrame(renderLoop);
      } else {
        // Finalize audio and recording
        osc1.stop();
        osc2.stop();
        audioContext.close();
        recorder.stop();
        resolve();
      }
    };

    requestAnimationFrame(renderLoop);
  });

  onProgress({
    phase: isSpanish ? "Guardando archivo MP4 y metadatos..." : "Saving video master & metadata...",
    percent: 100,
    currentFrame: totalFrames,
    totalFrames,
  });

  const videoBlob = await new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };
  });

  const videoBlobUrl = URL.createObjectURL(videoBlob);

  return {
    id: `vid-${Date.now()}`,
    title: scriptData.title,
    topic: settings.topic,
    durationMinutes: parseInt(settings.duration, 10),
    durationFormatted: `${settings.duration}:00`,
    createdAt: isSpanish ? "Reciente" : "Just now",
    status: "ready",
    thumbnailUrl: loadedImages[0]?.src || settings.stylePack.previewUrl,
    aspectRatio: "16:9",
    voiceName: `${settings.voice.name} (${isSpanish ? "Español" : "English"})`,
    stylePackName: settings.stylePack.name,
    scriptSnippet: scriptData.summary,
    seoTags: scriptData.seoTags,
    viewsCount: 1,
    videoBlobUrl,
    scenes: scriptData.scenes,
  };
}
