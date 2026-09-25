import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { topic, durationMinutes = 14 } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a world-class documentary scriptwriter and YouTube director.
Create a structured documentary script for the topic: "${topic}".
Duration target: ${durationMinutes} minutes.
Format: Return a strict JSON object with:
{
  "title": "Compelling high-CTR title",
  "scenes": [
    {
      "id": 1,
      "text": "Narrator voiceover script sentence...",
      "visualKeyword": "search keyword for footage like: 'ancient warships' or 'cargo ship sea'",
      "durationSeconds": 5
    }
  ],
  "seoTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "summary": "2-sentence summary of the documentary"
}
Generate 4-6 detailed scenes that tell a gripping story with a hook, conflict, and insight. Return ONLY raw JSON without markdown codeblocks.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "";
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    }

    // High quality procedural fallback when no API key is set
    return NextResponse.json(generateProceduralScript(topic));
  } catch (err: unknown) {
    console.error("Script generation error:", err);
    // Fallback gracefully
    const body = await req.json().catch(() => ({ topic: "General Documentary" }));
    return NextResponse.json(generateProceduralScript(body.topic || "Documentary"));
  }
}

function generateProceduralScript(topic: string) {
  const cleanTopic = topic.trim() || "The Great Global Chokepoints";
  return {
    title: cleanTopic.length > 55 ? `${cleanTopic.substring(0, 55)}...` : cleanTopic,
    summary: `A deep-dive investigative documentary exploring "${cleanTopic}", revealing the strategic decisions and hidden forces that shaped modern history.`,
    seoTags: [
      cleanTopic.split(" ")[0].toLowerCase() || "documentary",
      "history explained",
      "deep dive",
      "geopolitics",
      "analysis",
    ],
    scenes: [
      {
        id: 1,
        text: `Every major turning point in modern history begins with a single, often overlooked catalyst: ${cleanTopic}.`,
        visualKeyword: "cinematic landscape aerial mystery",
        durationSeconds: 6,
      },
      {
        id: 2,
        text: "Beneath the surface of conventional knowledge lies a complex web of geopolitical stakes, engineering marvels, and immense economic power.",
        visualKeyword: "technology world map data grid",
        durationSeconds: 7,
      },
      {
        id: 3,
        text: "When historians analyze the critical variables, the data reveals a pattern that most experts completely failed to anticipate.",
        visualKeyword: "archives investigation documents timeline",
        durationSeconds: 6,
      },
      {
        id: 4,
        text: "Today, as modern industry accelerates into an uncertain future, the lessons learned here remain more relevant than ever before.",
        visualKeyword: "futuristic city horizon epic sunset",
        durationSeconds: 6,
      },
    ],
  };
}
