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
          ? `Actúa como un galardonado director y guionista de documentales de YouTube de alta retención (estilo DW Documental, VisualPolitik, Lemmino).
Tema: "${userTopic}"
Duración objetivo: ${durationMinutes} minutos.

Escribe un guión documental profundo, riguroso y cinematográfico en ESPAÑOL neutro.
Genera entre 6 y 10 escenas consecutivas que cubran toda la historia paso a paso.
Incluye DATOS REALES específicos: fechas históricas, nombres de personajes clave, batallas o eventos cruciales, cifras y giros estratégicos.
REGLA CRÍTICA DE RETENCIÓN VISUAL: Para mantener al espectador pegado a la pantalla, la imagen de video debe cambiar cada 2.5 a 3 segundos (ritmo dinámico de B-roll). Por eso, cada escena DEBE incluir un array "visualKeywords" con 3 a 5 términos de búsqueda en inglés/español muy específicos y descriptivos (ej: ["ghost ship ocean storm fog", "empty ship deck abandoned sails", "vintage ship captain logbook", "ocean sunset historic painting"]).

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
      "visualKeyword": "Término principal para la escena",
      "visualKeywords": [
        "término plano 1 (primeros 3 seg)",
        "término plano 2 (siguientes 3 seg)",
        "término plano 3 (siguientes 3 seg)",
        "término plano 4 (cierre de escena)"
      ],
      "durationSeconds": 6
    }
  ]
}`
          : `You are a world-class high-retention documentary director and YouTube scriptwriter (style of DW Documentary, Vox, Lemmino).
Topic: "${userTopic}"
Target duration: ${durationMinutes} minutes.

Write a deeply factual, captivating, and well-researched documentary script in ENGLISH.
Generate 6 to 10 chronological scenes covering the entire investigation.
Include REAL FACTS: historical dates, key figures, turning points, statistics, and strategic impacts.
CRITICAL VISUAL RETENTION RULE: To keep viewers hooked, video shots must cut every 2.5 to 3 seconds. Each scene MUST include a "visualKeywords" array with 3 to 5 highly specific B-roll search queries (e.g. ["ghost ship ocean storm fog", "abandoned ship deck torn sails", "maritime navigation compass map", "historical archive document"]).

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
      "visualKeyword": "Main scene visual keyword",
      "visualKeywords": [
        "shot 1 keyword (first 3s)",
        "shot 2 keyword (next 3s)",
        "shot 3 keyword (next 3s)",
        "shot 4 keyword (scene outro)"
      ],
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
          visualKeywords: [
            `${cleanTopic} archivo historico retrato`,
            `${cleanTopic} mapa antiguo investigacion`,
            `${cleanTopic} pintura epica atmosfera cine`,
            `${cleanTopic} misterio documento antiguo`
          ],
          durationSeconds: 6,
        },
        {
          id: 2,
          text: `Para entender su verdadera dimensión, es necesario analizar el contexto original y las fuerzas ocultas que impulsaron su desarrollo.`,
          visualKeyword: `${cleanTopic} archivos mapas antiguos`,
          visualKeywords: [
            `${cleanTopic} cartas mapas pergamino`,
            `${cleanTopic} barco exploracion epoca`,
            `${cleanTopic} gabinete estrategico debate`,
            `${cleanTopic} horizonte niebla tormenta`
          ],
          durationSeconds: 6,
        },
        {
          id: 3,
          text: `Fue en los momentos de mayor tensión donde se tomaron las decisiones estratégicas que cambiaron definitivamente el rumbo de los acontecimientos.`,
          visualKeyword: `${cleanTopic} batalla punto de quiebre`,
          visualKeywords: [
            `${cleanTopic} conflicto decisivo drama`,
            `${cleanTopic} capitulo clave giro historico`,
            `${cleanTopic} investigacion forense pruebas`,
            `${cleanTopic} noche oscura reloj tiempo`
          ],
          durationSeconds: 6,
        },
        {
          id: 4,
          text: `Las consecuencias de estos hechos transformaron profundamente la estructura política, social y económica de su época.`,
          visualKeyword: `${cleanTopic} consecuencias impacto global`,
          visualKeywords: [
            `${cleanTopic} periodico portada archivo`,
            `${cleanTopic} comercio mundial tecnologia`,
            `${cleanTopic} monumento historico legado`,
            `${cleanTopic} archivo militar desclasificado`
          ],
          durationSeconds: 6,
        },
        {
          id: 5,
          text: `Hoy en día, el legado de ${cleanTopic} permanece como una lección fundamental sobre el poder, la estrategia y la historia humana.`,
          visualKeyword: `${cleanTopic} legado horizonte cine`,
          visualKeywords: [
            `${cleanTopic} atardecer cinematografico horizonte`,
            `${cleanTopic} museo artefacto reliquia`,
            `${cleanTopic} reflexion documental 4k`,
            `${cleanTopic} silueta misterio final`
          ],
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
        visualKeywords: [
          `${cleanTopic} historical portrait archive`,
          `${cleanTopic} vintage exploration map`,
          `${cleanTopic} dramatic atmospheric landscape`,
          `${cleanTopic} mysterious ancient artifact`
        ],
        durationSeconds: 6,
      },
      {
        id: 2,
        text: `Behind the surface lies a complex web of geopolitical interests, strategic decisions, and pivotal turning points.`,
        visualKeyword: `${cleanTopic} historical archives timeline`,
        visualKeywords: [
          `${cleanTopic} strategy boardroom planning`,
          `${cleanTopic} vintage nautical navigation chart`,
          `${cleanTopic} stormy ocean horizon`,
          `${cleanTopic} classified historical document`
        ],
        durationSeconds: 6,
      },
      {
        id: 3,
        text: `When critical evidence is examined, it reveals key moments where decisions altered the fate of nations.`,
        visualKeyword: `${cleanTopic} dramatic investigation conflict`,
        visualKeywords: [
          `${cleanTopic} pivotal turning point drama`,
          `${cleanTopic} intense historical confrontation`,
          `${cleanTopic} archival forensics evidence`,
          `${cleanTopic} ticking pocket watch timeline`
        ],
        durationSeconds: 6,
      },
      {
        id: 4,
        text: `The structural impact reverberated across global trade, technology, and international relations.`,
        visualKeyword: `${cleanTopic} world map industry power`,
        visualKeywords: [
          `${cleanTopic} vintage newspaper headline archive`,
          `${cleanTopic} industrial skyline technology`,
          `${cleanTopic} global trade shipping routes`,
          `${cleanTopic} historic monument memorial`
        ],
        durationSeconds: 6,
      },
      {
        id: 5,
        text: `Today, the enduring lessons of ${cleanTopic} continue to shape our world in unexpected and vital ways.`,
        visualKeyword: `${cleanTopic} epic landscape sunset horizon`,
        visualKeywords: [
          `${cleanTopic} epic cinematic sunset mountain`,
          `${cleanTopic} museum artifact preserved history`,
          `${cleanTopic} investigative documentary finale`,
          `${cleanTopic} silhouette looking toward horizon`
        ],
        durationSeconds: 6,
      },
    ],
  };
}
