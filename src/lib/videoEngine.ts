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

const DIVERSE_HISTORICAL_IMAGES = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1280&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1280&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1280&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1280&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1280&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1280&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1280&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1280&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1280&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1280&auto=format&fit=crop&q=80",
];

/**
 * Fetch dynamic imagery from multi-source search (/api/media-search) with guaranteed CORS proxy
 */
export async function fetchThematicVisual(
  query: string,
  visualSource: VisualSourceMode = "auto",
  sceneIndex: number = 0,
  fallbackUrl?: string
): Promise<string> {
  const safeFallback = fallbackUrl || DIVERSE_HISTORICAL_IMAGES[sceneIndex % DIVERSE_HISTORICAL_IMAGES.length];
  try {
    const cleanQuery = query.replace(/[^\w\s\u00C0-\u017F]/gi, " ").trim();
    if (!cleanQuery) return `/api/proxy-image?url=${encodeURIComponent(safeFallback)}`;

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
        // Pick an item by scene index to maximize visual variation across scenes
        const picked = data.media[sceneIndex % data.media.length];
        if (picked && picked.url) {
          return `/api/proxy-image?url=${encodeURIComponent(picked.url)}`;
        }
      }
    }
  } catch (err) {
    console.warn("Media search error, using proxy fallback visual:", err);
  }

  return `/api/proxy-image?url=${encodeURIComponent(safeFallback)}`;
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

  // 3. Preload Multiple Dynamic B-Roll Images for Each Scene (Cut every 2.5 - 3.2s)
  onProgress({
    phase: isSpanish
      ? "Buscando tomas de apoyo (B-roll) de alta retención para cada escena..."
      : "Fetching dynamic B-roll visual shots for each scene...",
    percent: 38,
    currentFrame: 0,
    totalFrames: 100,
  });

  const loadedSceneImages: HTMLImageElement[][] = [];
  let globalShotCounter = 0;

  for (let i = 0; i < updatedScenes.length; i++) {
    const scene = updatedScenes[i];
    const dur = scene.durationSeconds || 6;
    // Calculate how many cuts/shots are needed so each shot lasts ~2.6 - 3.2 seconds
    const shotsCount = Math.max(2, Math.min(8, Math.ceil(dur / 2.8)));

    // Gather candidate visual keywords for this scene's shots
    const rawKeywords: string[] = [];
    if (scene.visualKeywords && Array.isArray(scene.visualKeywords) && scene.visualKeywords.length > 0) {
      rawKeywords.push(...scene.visualKeywords);
    }
    if (scene.visualKeyword) {
      rawKeywords.push(scene.visualKeyword);
    }
    if (rawKeywords.length === 0) {
      rawKeywords.push(`${settings.topic} documentary scene ${i + 1}`);
    }

    const sceneShots: HTMLImageElement[] = [];
    const shotUrls: string[] = [];

    for (let s = 0; s < shotsCount; s++) {
      const kw = rawKeywords[s % rawKeywords.length] || `${settings.topic} historical shot ${s + 1}`;
      const visualUrl = await fetchThematicVisual(
        kw,
        settings.visualSource || "auto",
        globalShotCounter,
        DIVERSE_HISTORICAL_IMAGES[globalShotCounter % DIVERSE_HISTORICAL_IMAGES.length]
      );
      shotUrls.push(visualUrl);
      globalShotCounter++;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = visualUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = () => {
          const fallbackSrc = `/api/proxy-image?url=${encodeURIComponent(
            DIVERSE_HISTORICAL_IMAGES[globalShotCounter % DIVERSE_HISTORICAL_IMAGES.length]
          )}`;
          img.src = fallbackSrc;
          img.onload = resolve;
          img.onerror = resolve;
        };
      });
      sceneShots.push(img);
    }

    scene.imageUrls = shotUrls;
    scene.imageUrl = shotUrls[0];
    loadedSceneImages.push(sceneShots);
  }

  // 4. Schedule Speech Narration onto the Recording Stream at Exact Scene Timings
  const audioStartContextTime = audioContext.currentTime + 0.3; // Precise audio clock baseline
  let accumulatedTime = 0;
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

      // Start speech at exact hardware clock second
      sourceNode.start(audioStartContextTime + accumulatedTime);
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
  const totalVideoSeconds = Math.max(10, accumulatedTime + 0.6);
  const totalFrames = Math.ceil(fps * totalVideoSeconds);

  let frameCount = 0;

  await new Promise<void>((resolve) => {
    const renderLoop = () => {
      frameCount++;
      // Hardware-synchronized elapsed time from AudioContext
      const currentSeconds = Math.max(0, audioContext.currentTime - audioStartContextTime);
      const progressPercent = Math.min(98, 45 + Math.round((currentSeconds / totalVideoSeconds) * 52));

      onProgress({
        phase: isSpanish
          ? `Componiendo documental sincronizado (${Math.round(currentSeconds)}s / ${Math.round(totalVideoSeconds)}s)...`
          : `Compositing synchronized documentary (${Math.round(currentSeconds)}s / ${Math.round(totalVideoSeconds)}s)...`,
        percent: progressPercent,
        currentFrame: frameCount,
        totalFrames,
      });

      // Determine active scene from exact audio timeline
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
      const sceneShots = loadedSceneImages[activeSceneIndex] || [];
      const sceneDur = Math.max(1, activeScene.durationSeconds || 6);
      const totalShotsInScene = Math.max(1, sceneShots.length);
      const shotDuration = sceneDur / totalShotsInScene; // ~2.5 - 3.0s per cut

      const currentShotIndex = Math.min(
        totalShotsInScene - 1,
        Math.floor(sceneLocalTime / shotDuration)
      );
      const shotLocalTime = sceneLocalTime - currentShotIndex * shotDuration;
      const shotProgress = Math.min(1, Math.max(0, shotLocalTime / shotDuration));

      const currentImg = sceneShots[currentShotIndex] || sceneShots[0];
      const prevImg = currentShotIndex > 0 ? sceneShots[currentShotIndex - 1] : null;

      // Draw background visual with dynamic Ken Burns movement on each cut
      ctx.fillStyle = "#0E0C0B";
      ctx.fillRect(0, 0, width, height);

      const renderKenBurnsImage = (
        img: HTMLImageElement | undefined,
        progress: number,
        shotIdx: number,
        alpha: number = 1.0
      ) => {
        if (!img || !img.complete || img.naturalWidth <= 0) return;
        ctx.save();
        ctx.globalAlpha = alpha;

        // Alternate camera motions per shot: Zoom-in, Zoom-out, Pan-right, Pan-left
        const motionType = shotIdx % 4;
        let zoom = 1.0;
        let panX = 0;
        const panY = 0;

        if (motionType === 0) {
          // Slow dramatic push-in
          zoom = 1.0 + progress * 0.09;
        } else if (motionType === 1) {
          // Slow dramatic pull-out
          zoom = 1.09 - progress * 0.09;
          panX = (progress - 0.5) * 35;
        } else if (motionType === 2) {
          // Tracking pan right with steady zoom
          zoom = 1.06;
          panX = (progress - 0.5) * 55;
        } else {
          // Tracking pan left with subtle zoom
          zoom = 1.04 + Math.sin(progress * Math.PI) * 0.03;
          panX = (0.5 - progress) * 55;
        }

        const drawW = width * zoom;
        const drawH = height * zoom;
        const drawX = (width - drawW) / 2 + panX;
        const drawY = (height - drawH) / 2 + panY;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      };

      // If within the first 0.32s of a cut and we have a previous image, crossfade smoothly
      const crossfadeWindow = 0.32;
      if (shotLocalTime < crossfadeWindow && prevImg) {
        renderKenBurnsImage(prevImg, 1.0, currentShotIndex - 1, 1.0);
        const blend = Math.max(0, Math.min(1, shotLocalTime / crossfadeWindow));
        renderKenBurnsImage(currentImg, shotProgress, currentShotIndex, blend);
      } else {
        renderKenBurnsImage(currentImg, shotProgress, currentShotIndex, 1.0);
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

      // Draw burned-in kinetic subtitles with large, readable chunked typography
      if (settings.subtitlesOn && activeScene) {
        const rawWords = activeScene.text.trim().split(/\s+/).filter(Boolean);
        const dur = Math.max(1, activeScene.durationSeconds || 6);
        const wordsCount = rawWords.length;

        if (wordsCount > 0) {
          // Exact synchronized progress inside this scene
          const sceneProgress = Math.min(0.999, Math.max(0, sceneLocalTime / dur));
          const currentWordIndex = Math.floor(sceneProgress * wordsCount);

          // Dynamic Chunking: 4 words per subtitle card for optimal readability
          const CHUNK_SIZE = 4;
          const chunkIndex = Math.floor(currentWordIndex / CHUNK_SIZE);
          const chunkStart = chunkIndex * CHUNK_SIZE;
          const chunkEnd = Math.min(wordsCount, chunkStart + CHUNK_SIZE);
          const chunkWords = rawWords.slice(chunkStart, chunkEnd);
          const activeWordInChunk = currentWordIndex - chunkStart;

          // Select font family
          let fontFam = "'Inter', -apple-system, sans-serif";
          if (settings.subtitleFont === "bebas_neue") fontFam = "'Bebas Neue', Impact, sans-serif";
          else if (settings.subtitleFont === "poppins") fontFam = "'Poppins', sans-serif";
          else if (settings.subtitleFont === "lora") fontFam = "'Lora', Georgia, serif";
          else if (settings.subtitleFont === "roboto") fontFam = "'Roboto', sans-serif";

          ctx.save();
          ctx.font = `900 36px ${fontFam}`;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";

          // Calculate widths
          const wordSpacings: number[] = [];
          let totalChunkWidth = 0;
          const spaceWidth = ctx.measureText(" ").width;

          for (const w of chunkWords) {
            const wWidth = ctx.measureText(w).width;
            wordSpacings.push(wWidth);
            totalChunkWidth += wWidth;
          }
          totalChunkWidth += spaceWidth * Math.max(0, chunkWords.length - 1);

          const centerY = height - 100;
          const paddingX = 26;
          const cardHeight = 62;
          const cardWidth = Math.min(width - 80, totalChunkWidth + paddingX * 2);
          const startX = (width - cardWidth) / 2;

          // 1. Draw subtitle style background
          if (settings.subtitleStyle !== "clean" && settings.subtitleStyle !== "minimal") {
            ctx.fillStyle = "rgba(12, 10, 9, 0.88)";
            ctx.beginPath();
            ctx.roundRect(startX, centerY - cardHeight / 2, cardWidth, cardHeight, 14);
            ctx.fill();

            ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // 2. Draw each word in the active phrase
          let cursorX = startX + (cardWidth - totalChunkWidth) / 2;

          for (let i = 0; i < chunkWords.length; i++) {
            const word = chunkWords[i];
            const isCurrent = i === activeWordInChunk;
            const wWidth = wordSpacings[i];

            // Active word highlight background in karaoke mode
            if (isCurrent && (settings.subtitleStyle === "karaoke" || settings.subtitleStyle === "word")) {
              ctx.fillStyle = "rgba(217, 72, 46, 0.35)";
              ctx.beginPath();
              ctx.roundRect(cursorX - 5, centerY - 24, wWidth + 10, 48, 8);
              ctx.fill();
            }

            // Strong black text stroke for ultra-high contrast on any background
            ctx.strokeStyle = "rgba(0, 0, 0, 0.95)";
            ctx.lineWidth = 6;
            ctx.lineJoin = "round";
            ctx.strokeText(word, cursorX, centerY);

            // Active word color (Vibrant gold/yellow or bright white)
            if (isCurrent) {
              ctx.fillStyle = settings.subtitleStyle === "minimal" ? "#FFFFFF" : "#FFD000";
            } else {
              ctx.fillStyle = "#FAFAF7";
            }

            ctx.fillText(word, cursorX, centerY);
            cursorX += wWidth + spaceWidth;
          }

          ctx.restore();
        }
      }

      // Watermark
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = "11px monospace";
      ctx.textAlign = "right";
      ctx.fillText("KUTLY AI DOCUMENTARY STUDIO", width - 35, 35);

      if (currentSeconds < totalVideoSeconds) {
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
    thumbnailUrl: loadedSceneImages[0]?.[0]?.src || settings.stylePack.previewUrl,
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
