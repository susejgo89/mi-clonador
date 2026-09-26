import { NextRequest, NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { 
      text, 
      voice = "es-MX-JorgeNeural", 
      provider = "edge",
      apiKey = ""
    } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const cleanText = text.trim();

    // 1. ElevenLabs Provider (If requested and API key provided)
    if (provider === "elevenlabs" && apiKey) {
      try {
        const elevenVoiceId = "21m00Tcm4TlvDq8ikWAM"; // Default Rachel / customizable
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenVoiceId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          body: JSON.stringify({
            text: cleanText,
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        });

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();
          return new NextResponse(audioBuffer, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": audioBuffer.byteLength.toString(),
            },
          });
        }
      } catch (elevenErr) {
        console.warn("ElevenLabs TTS fallback to Edge TTS:", elevenErr);
      }
    }

    // 2. Microsoft Edge Neural TTS (100% Free, Human Studio Quality)
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
      const { audioStream } = tts.toStream(cleanText);

      const chunks: Buffer[] = [];
      await new Promise<void>((resolve, reject) => {
        audioStream.on("data", (chunk: Buffer) => chunks.push(chunk));
        audioStream.on("end", () => resolve());
        audioStream.on("error", (err: Error) => reject(err));
      });

      const audioBuffer = Buffer.concat(chunks);

      return new NextResponse(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": audioBuffer.length.toString(),
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (edgeErr) {
      console.error("Edge TTS Error:", edgeErr);
      return NextResponse.json({ error: "Failed to synthesize speech" }, { status: 500 });
    }
  } catch (err: unknown) {
    console.error("TTS Route Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
