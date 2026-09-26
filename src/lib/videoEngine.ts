import { VideoSettings, VideoScene, GeneratedVideo, VisualSourceMode } from "@/types/kutly";

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
 * Fetch high quality neural TTS audio array buffer from the local backend (/api/tts)
 */
export async function generateSpeechAudioBuffer(
  text: string,
  voiceEdgeId: string = "es-MX-JorgeNeural"
): Promise<{ arrayBuffer: ArrayBuffer; duration: number }> {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice: voiceEdgeId,
      }),
    });

    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      return { arrayBuffer, duration: 6 };
    }
  } catch (err) {
    console.warn("TTS API fetch error, using silent fallback:", err);
  }

  return { arrayBuffer: new ArrayBuffer(0), duration: 6 };
}

/**
 * Fetch dynamic imagery from multi-source search (/api/media-search)
 */
export async function fetchThematicVisual(
  query: string,
  visualSource: VisualSourceMode = "auto",
  fallbackUrl: string = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1280&auto=format&fit=crop&q=80"
): Promise<string> {
  try {
    const cleanQuery = query.replace(/[^\w\s\u00C0-\u017F]/gi, " ").trim();
    if (!cleanQuery) return fallbackUrl;

    const res = await fetch("/api/media-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: cleanQuery,
        source: visualSource,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.media && data.media.length > 0) {
        return data.media[0].url;
      }
    }
  } catch (err) {
    console.warn("Media search error, using fallback visual:", err);
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
    console.warn("API script fetch failed, using procedural script:", err);
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
        visualKeyword: `${cleanTopic} pintura historica documental`,
        durationSeconds: 7,
      },
      {
        id: 2,
        text: isSpanish
          ? "Bajo la superficie de la narrativa oficial, existe un complejo entramado de intereses geopolíticos, económicos y estratégicos."
          : "Beneath the surface lies a complex web of geopolitical stakes, strategic maneuvers, and immense economic power.",
        visualKeyword: `${cleanTopic} archivos mapas antiguos`,
        durationSeconds: 7,
      },
      {
        id: 3,
        text: isSpanish
          ? "Cuando los historiadores analizan los documentos y datos originales, se revela un momento crítico que cambió el destino de su época."
          : "When historians examine the original archives, the data reveals a critical turning point that altered modern history.",
        visualKeyword: `${cleanTopic} investigacion batalla`,
        durationSeconds: 7,
      },
      {
        id: 4,
        text: isSpanish
          ? "Las repercusiones de estos hechos transformaron las estructuras de poder y sentaron las bases del mundo contemporáneo."
          : "The structural consequences reverberated across global trade, technology, and international relations.",
        visualKeyword: `${cleanTopic} consecuencias impacto global`,
        durationSeconds: 7,
      },
      {
        id: 5,
        text: isSpanish
          ? "Hoy en día, las lecciones aprendidas de esta historia continúan influyendo de manera directa en nuestra sociedad."
          : "Today, the enduring lessons learned here remain more relevant than ever before.",
        visualKeyword: `${cleanTopic} legado horizonte cine`,
        durationSeconds: 7,
      },
    ],
  };
}

/**
 * Creates a real client-side synthesized video using Canvas 2D + Real Neural Speech Audio + MediaRecorder
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

  // 1. Initialize Audio Context & Stream Destination
  onProgress({
    phase: isSpanish ? "Sintetizando locución neuronal humana con Edge-TTS..." : "Synthesizing neural voiceover with Edge-TTS...",
    percent: 10,
    currentFrame: 0,
    totalFrames: 100,
  });

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioContext = new AudioCtx();
  const dest = audioContext.createMediaStreamDestination();

  const edgeVoice = settings.voice?.edgeVoiceId || (isSpanish ? "es-MX-JorgeNeural" : "en-US-GuyNeural");

  // 2. Fetch and Decode Speech Audio Buffers for Every Scene
  const decodedAudioBuffers: (AudioBuffer | null)[] = [];
  const updatedScenes: VideoScene[] = [];
  const sceneAudioUrls: string[] = [];

  for (let i = 0; i < scriptData.scenes.length; i++) {
    const sc = scriptData.scenes[i];
    onProgress({
      phase: isSpanish
        ? `Sintetizando locución escena ${i + 1} de ${scriptData.scenes.length} con voz de ${settings.voice.name}...`
        : `Synthesizing scene ${i + 1} of ${scriptData.scenes.length}...`,
      percent: 10 + Math.round((i / scriptData.scenes.length) * 25),
      currentFrame: 0,
      totalFrames: 100,
    });

    const { arrayBuffer } = await generateSpeechAudioBuffer(sc.text, edgeVoice);

    let decoded: AudioBuffer | null = null;
    let sceneDuration = 6.5;

    if (arrayBuffer && arrayBuffer.byteLength > 0) {
      try {
        decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
        sceneDuration = Math.max(4.5, decoded.duration + 0.6);

        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const blobUrl = URL.createObjectURL(blob);
        sceneAudioUrls.push(blobUrl);
      } catch (decodeErr) {
        console.warn("Audio buffer decode fallback:", decodeErr);
        sceneDuration = Math.max(5, Math.ceil(sc.text.split(" ").length * 0.42));
      }
    } else {
      sceneDuration = Math.max(5, Math.ceil(sc.text.split(" ").length * 0.42));
    }

    decodedAudioBuffers.push(decoded);
    updatedScenes.push({
      ...sc,
      durationSeconds: sceneDuration,
      audioUrl: sceneAudioUrls[i] || "",
    });
  }

  // 3. Preload Unique Visual Images for Each Scene
  onProgress({
    phase: isSpanish ? "Buscando metraje e imágenes en alta resolución para cada escena..." : "Fetching unique visual assets for each scene...",
    percent: 40,
    currentFrame: 0,
    totalFrames: 100,
  });

  const loadedImages: HTMLImageElement[] = [];

  for (let i = 0; i < updatedScenes.length; i++) {
    const scene = updatedScenes[i];
    const visualQuery = scene.visualKeyword || `${settings.topic} scene ${i + 1}`;
    const visualUrl = await fetchThematicVisual(
      visualQuery,
      settings.visualSource || "auto",
      settings.stylePack.previewUrl
    );

    scene.imageUrl = visualUrl;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = visualUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = () => {
        img.src = settings.stylePack.previewUrl;
        resolve(null);
      };
    });
    loadedImages.push(img);
  }

  // 4. Schedule Speech Narration onto the Recording Stream at Exact Scene Timings
  let accumulatedTime = 0.2; // slight pre-roll
  const sceneTimeline: { startTime: number; endTime: number; duration: number }[] = [];

  for (let i = 0; i < updatedScenes.length; i++) {
    const dur = updatedScenes[i].durationSeconds;
    const buf = decodedAudioBuffers[i];

    if (buf) {
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = buf;

      const voiceGain = audioContext.createGain();
      voiceGain.gain.setValueAtTime(1.0, audioContext.currentTime);

      sourceNode.connect(voiceGain);
      voiceGain.connect(dest);

      // Start speech at exact scheduled second
      sourceNode.start(audioContext.currentTime + accumulatedTime);
    }

    sceneTimeline.push({
      startTime: accumulatedTime,
      endTime: accumulatedTime + dur,
      duration: dur,
    });

    accumulatedTime += dur;
  }

  // 5. Connect Ambient Soundtrack into Recording Stream
  const osc1 = audioContext.createOscillator();
  const osc2 = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  const musicGain = audioContext.createGain();

  osc1.type = "sine";
  osc1.frequency.setValueAtTime(110, audioContext.currentTime); // A2 note
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(164.81, audioContext.currentTime); // E3 note

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(450, audioContext.currentTime);
  musicGain.gain.setValueAtTime(0.045, audioContext.currentTime);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(musicGain);
  musicGain.connect(dest);

  osc1.start();
  osc2.start();

  // 6. Setup Canvas and MediaRecorder
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get 2D canvas context");
  }

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
    videoBitsPerSecond: 4_000_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.start(100);

  // Total recording duration based on actual spoken audio length
  const totalVideoSeconds = Math.max(10, accumulatedTime + 0.5);
  const totalFrames = Math.ceil(fps * totalVideoSeconds);

  let frameCount = 0;

  await new Promise<void>((resolve) => {
    const renderLoop = () => {
      frameCount++;
      const currentSeconds = frameCount / fps;
      const progressPercent = Math.min(96, 45 + Math.round((frameCount / totalFrames) * 50));

      onProgress({
        phase: isSpanish
          ? `Componiendo escenas, voz y subtítulos (${frameCount}/${totalFrames} fotogramas)...`
          : `Compositing scenes, neural voice & subtitles (${frameCount}/${totalFrames} frames)...`,
        percent: progressPercent,
        currentFrame: frameCount,
        totalFrames,
      });

      // Determine active scene from timeline
      let activeSceneIndex = 0;
      let sceneLocalTime = 0;

      for (let i = 0; i < sceneTimeline.length; i++) {
        const timing = sceneTimeline[i];
        if (currentSeconds >= timing.startTime && currentSeconds < timing.endTime) {
          activeSceneIndex = i;
          sceneLocalTime = currentSeconds - timing.startTime;
          break;
        }
        if (currentSeconds >= timing.endTime) {
          activeSceneIndex = i;
          sceneLocalTime = timing.duration;
        }
      }

      const activeScene = updatedScenes[activeSceneIndex] || updatedScenes[0];
      const activeImg = loadedImages[activeSceneIndex] || loadedImages[0];

      // Draw background visual with Ken Burns slow cinematic zoom
      ctx.fillStyle = "#0E0C0B";
      ctx.fillRect(0, 0, width, height);

      if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
        const zoom = 1 + (frameCount % (fps * 8)) * 0.0015;
        const drawW = width * zoom;
        const drawH = height * zoom;
        const drawX = (width - drawW) / 2;
        const drawY = (height - drawH) / 2;
        ctx.drawImage(activeImg, drawX, drawY, drawW, drawH);
      }

      // Apply Style Pack color grading
      if (settings.stylePack.id === "noir") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.52)";
        ctx.fillRect(0, 0, width, height);
      } else if (settings.stylePack.id === "velvet") {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, "rgba(217, 72, 46, 0.18)");
        grad.addColorStop(0.5, "rgba(14, 12, 11, 0.35)");
        grad.addColorStop(1, "rgba(14, 12, 11, 0.92)");
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
        const dur = activeScene.durationSeconds || 6;
        const wordsPerSec = Math.max(1, words.length / dur);
        const activeWordIdx = Math.min(words.length - 1, Math.floor(sceneLocalTime * wordsPerSec));

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
    durationFormatted: `${Math.floor(totalVideoSeconds / 60)}:${Math.floor(totalVideoSeconds % 60).toString().padStart(2, "0")}`,
    createdAt: isSpanish ? "Reciente" : "Just now",
    status: "ready",
    thumbnailUrl: loadedImages[0]?.src || settings.stylePack.previewUrl,
    aspectRatio: "16:9",
    voiceName: `${settings.voice.name} (${settings.voice.accent || "Español"})`,
    stylePackName: settings.stylePack.name,
    scriptSnippet: scriptData.summary,
    seoTags: scriptData.seoTags,
    viewsCount: 1,
    videoBlobUrl,
    scenes: updatedScenes,
  };
}
