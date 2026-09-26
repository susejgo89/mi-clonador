import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  let userTopic = "El Impacto de la Inteligencia Artificial";
  let isSpanish = true;

  try {
    const body = await req.json();
    userTopic = (body.topic || "").trim() || userTopic;
    const durationMinutes = body.durationMinutes || 14;

    // Detect language
    isSpanish = /[áéíóúñ¿¡]|(\b(el|la|los|las|de|en|por|que|un|una|del|al|historia|guerra|misterio|como|porque|quien|sobre|imperio|roma|caida|crisis|revolucion|siglo|año)\b)/i.test(
      userTopic
    );

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = isSpanish
          ? `Actúa como un galardonado director y guionista de documentales de YouTube (estilo DW Documental, VisualPolitik, History Channel).
Tema: "${userTopic}"
Duración objetivo: ${durationMinutes} minutos.

Escribe un guión documental profundo, riguroso y cinematográfico en ESPAÑOL neutro.
Genera entre 6 y 10 escenas consecutivas que cubran toda la historia paso a paso.
Incluye DATOS REALES específicos: fechas históricas, nombres de personajes clave, batallas o eventos cruciales, cifras y giros estratégicos.
IMPORTANTE: Cada escena DEBE tener un "visualKeyword" completamente ÚNICO y muy descriptivo en inglés/español para buscar una imagen o pintura histórica diferente (ej: "WW2 bomber aircraft cockpit", "night sky anti-aircraft fire", "snow pine forest crash site", "vintage medical report archive").

Estructura de respuesta: Devuelve ÚNICAMENTE un objeto JSON con este formato exacto:
{
  "title": "Título llamativo, periodístico y de alto impacto en español",
  "summary": "Resumen de 2-3 oraciones que explica la tesis central y los descubrimientos de la investigación",
  "language": "es",
  "seoTags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "scenes": [
    {
      "id": 1,
      "text": "Narración introductoria con gancho y contexto histórico/científico real...",
      "visualKeyword": "Término visual único y específico para escena 1",
      "durationSeconds": 6
    },
    {
      "id": 2,
      "text": "Narración sobre los antecedentes y las causas ocultas...",
      "visualKeyword": "Término visual único y específico para escena 2",
      "durationSeconds": 6
    },
    {
      "id": 3,
      "text": "Narración del punto de inflexión, conflicto clave o momento determinante...",
      "visualKeyword": "Término visual único y específico para escena 3",
      "durationSeconds": 6
    },
    {
      "id": 4,
      "text": "Narración del clímax o evento extraordinario...",
      "visualKeyword": "Término visual único y específico para escena 4",
      "durationSeconds": 6
    },
    {
      "id": 5,
      "text": "Narración de las consecuencias geopolíticas o impacto...",
      "visualKeyword": "Término visual único y específico para escena 5",
      "durationSeconds": 6
    },
    {
      "id": 6,
      "text": "Narración de conclusión y lección histórica...",
      "visualKeyword": "Término visual único y específico para escena 6",
      "durationSeconds": 6
    }
  ]
}`
          : `You are a world-class documentary director and YouTube scriptwriter (style of DW Documentary, Vox, RealLifeLore).
Topic: "${userTopic}"
Target duration: ${durationMinutes} minutes.

Write a deeply factual, captivating, and well-researched documentary script in ENGLISH.
Generate 6 to 10 chronological scenes covering the entire investigation.
Include REAL FACTS: historical dates, key figures, turning points, statistics, and strategic impacts.
IMPORTANT: Each scene MUST have a completely UNIQUE and highly descriptive "visualKeyword" (e.g. "WW2 bomber cockpit night", "aircraft engine fire", "snow forest pine branches", "vintage hospital archive document").

Return ONLY a valid JSON object matching this format:
{
  "title": "High-CTR, investigative documentary title",
  "summary": "2-3 sentence overview explaining the central investigation and key takeaways",
  "language": "en",
  "seoTags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "scenes": [
    {
      "id": 1,
      "text": "Opening hook narration introducing the core mystery or turning point...",
      "visualKeyword": "Unique visual keyword for scene 1",
      "durationSeconds": 6
    },
    {
      "id": 2,
      "text": "Contextual background and hidden geopolitical or scientific causes...",
      "visualKeyword": "Unique visual keyword for scene 2",
      "durationSeconds": 6
    },
    {
      "id": 3,
      "text": "The critical crisis, battle, or turning point with real names and dates...",
      "visualKeyword": "Unique visual keyword for scene 3",
      "durationSeconds": 6
    },
    {
      "id": 4,
      "text": "The climax or dramatic breakthrough...",
      "visualKeyword": "Unique visual keyword for scene 4",
      "durationSeconds": 6
    },
    {
      "id": 5,
      "text": "The global fallout and structural consequences...",
      "visualKeyword": "Unique visual keyword for scene 5",
      "durationSeconds": 6
    },
    {
      "id": 6,
      "text": "Conclusion, long-term legacy, and modern implications...",
      "visualKeyword": "Unique visual keyword for scene 6",
      "durationSeconds": 6
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            thinkingConfig: {
              thinkingBudget: 0,
            },
            temperature: 0.7,
          },
        });

        const rawText = (response.text || "").trim();
        const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
        const parsed = JSON.parse(cleaned);

        if (parsed && Array.isArray(parsed.scenes) && parsed.scenes.length > 0) {
          return NextResponse.json(parsed);
        }
      } catch (aiError) {
        console.error("Gemini SDK error in route:", aiError);
      }
    }

    // Fallback using the user's ACTUAL topic
    return NextResponse.json(generateProceduralScript(userTopic, isSpanish));
  } catch (err: unknown) {
    console.error("Script generation route error:", err);
    return NextResponse.json(generateProceduralScript(userTopic, isSpanish));
  }
}

function generateProceduralScript(topic: string, isSpanish: boolean) {
  const cleanTopic = topic.trim() || (isSpanish ? "Grandes Enigmas de la Historia" : "Great Mysteries of History");

  if (isSpanish) {
    return {
      title: `La Verdad Detrás de ${cleanTopic}: Investigación Completa`,
      summary: `Un análisis documental exhaustivo sobre ${cleanTopic}, examinando los factores determinantes, las decisiones críticas y su impacto duradero en el mundo moderno.`,
      language: "es",
      seoTags: [
        cleanTopic.toLowerCase().slice(0, 25),
        "documental español",
        "historia explicada",
        "investigacion",
        "analisis geopolitico",
        "curiosidades",
      ],
      scenes: [
        {
          id: 1,
          text: `A lo largo de los siglos, pocos temas han generado tanto impacto y debate como ${cleanTopic}.`,
          visualKeyword: `${cleanTopic} historia documental`,
          durationSeconds: 6,
        },
        {
          id: 2,
          text: `Para entender su verdadera dimensión, es necesario analizar el contexto original y las fuerzas ocultas que impulsaron su desarrollo.`,
          visualKeyword: `${cleanTopic} archivos mapas antiguos`,
          durationSeconds: 6,
        },
        {
          id: 3,
          text: `Fue en los momentos de mayor tensión donde se tomaron las decisiones estratégicas que cambiaron definitivamente el rumbo de los acontecimientos.`,
          visualKeyword: `${cleanTopic} batalla punto de quiebre`,
          durationSeconds: 6,
        },
        {
          id: 4,
          text: `Las consecuencias de estos hechos transformaron profundamente la estructura política, social y económica de su época.`,
          visualKeyword: `${cleanTopic} consecuencias impacto global`,
          durationSeconds: 6,
        },
        {
          id: 5,
          text: `Hoy en día, el legado de ${cleanTopic} permanece como una lección fundamental sobre el poder, la estrategia y la historia humana.`,
          visualKeyword: `${cleanTopic} legado horizonte cine`,
          durationSeconds: 6,
        },
      ],
    };
  }

  return {
    title: `The Untold Truth of ${cleanTopic}: Full Documentary`,
    summary: `An in-depth documentary investigation into ${cleanTopic}, breaking down key historical turning points, hidden factors, and modern consequences.`,
    language: "en",
    seoTags: [
      cleanTopic.toLowerCase().slice(0, 25),
      "documentary explained",
      "history deep dive",
      "investigation",
      "geopolitics",
      "analysis",
    ],
    scenes: [
      {
        id: 1,
        text: `Throughout modern history, few events have carried such profound significance as ${cleanTopic}.`,
        visualKeyword: `${cleanTopic} cinematic landscape history`,
        durationSeconds: 6,
      },
      {
        id: 2,
        text: `Behind the surface lies a complex web of geopolitical interests, strategic decisions, and pivotal turning points.`,
        visualKeyword: `${cleanTopic} historical archives timeline`,
        durationSeconds: 6,
      },
      {
        id: 3,
        text: `When critical evidence is examined, it reveals key moments where decisions altered the fate of nations.`,
        visualKeyword: `${cleanTopic} dramatic investigation conflict`,
        durationSeconds: 6,
      },
      {
        id: 4,
        text: `The structural impact reverberated across global trade, technology, and international relations.`,
        visualKeyword: `${cleanTopic} world map industry power`,
        durationSeconds: 6,
      },
      {
        id: 5,
        text: `Today, the enduring lessons of ${cleanTopic} continue to shape our world in unexpected and vital ways.`,
        visualKeyword: `${cleanTopic} epic landscape sunset horizon`,
        durationSeconds: 6,
      },
    ],
  };
}
