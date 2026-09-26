import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface MediaItem {
  url: string;
  source: "ai" | "pexels" | "pixabay" | "wikimedia" | "unsplash";
  title: string;
  thumbnail: string;
}

export async function POST(req: NextRequest) {
  try {
    const { 
      query = "history documentary", 
      source = "auto", 
      pexelsKey = "", 
      pixabayKey = "" 
    } = await req.json();

    const cleanQuery = query.replace(/[^\w\s\u00C0-\u017F]/gi, " ").trim() || "documentary";
    const results: MediaItem[] = [];

    // 1. Pexels API (if key provided or auto)
    const finalPexelsKey = pexelsKey || process.env.PEXELS_API_KEY;
    if (finalPexelsKey && (source === "pexels" || source === "auto")) {
      try {
        const res = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(cleanQuery)}&per_page=6&orientation=landscape`,
          { headers: { Authorization: finalPexelsKey } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.photos && data.photos.length > 0) {
            for (const p of data.photos) {
              results.push({
                url: p.src.large2x || p.src.large || p.src.original,
                source: "pexels",
                title: p.alt || `Pexels: ${cleanQuery}`,
                thumbnail: p.src.medium || p.src.small,
              });
            }
          }
        }
      } catch (err) {
        console.warn("Pexels fetch error:", err);
      }
    }

    // 2. Pixabay API (if key provided or auto)
    const finalPixabayKey = pixabayKey || process.env.PIXABAY_API_KEY;
    if (finalPixabayKey && (source === "pixabay" || (source === "auto" && results.length < 3))) {
      try {
        const res = await fetch(
          `https://pixabay.com/api/?key=${finalPixabayKey}&q=${encodeURIComponent(
            cleanQuery
          )}&image_type=photo&orientation=horizontal&per_page=6`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.hits && data.hits.length > 0) {
            for (const hit of data.hits) {
              results.push({
                url: hit.largeImageURL || hit.webformatURL,
                source: "pixabay",
                title: hit.tags || `Pixabay: ${cleanQuery}`,
                thumbnail: hit.webformatURL || hit.previewURL,
              });
            }
          }
        }
      } catch (err) {
        console.warn("Pixabay fetch error:", err);
      }
    }

    // 3. Wikipedia / Wikimedia Commons Historical Archive (100% Free Public Domain)
    if (source === "wikimedia" || source === "auto" || results.length < 2) {
      for (const lang of ["es", "en"]) {
        try {
          const wikiUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(
            cleanQuery
          )}&gsrlimit=5&prop=pageimages&pithumbsize=1280&origin=*`;
          const res = await fetch(wikiUrl);
          if (res.ok) {
            const data = await res.json();
            const pages = data?.query?.pages;
            if (pages) {
              for (const id in pages) {
                const src = pages[id]?.thumbnail?.source;
                if (src && typeof src === "string" && src.startsWith("http")) {
                  results.push({
                    url: src,
                    source: "wikimedia",
                    title: pages[id].title || `Wikipedia Archive: ${cleanQuery}`,
                    thumbnail: src,
                  });
                }
              }
            }
          }
        } catch (wikiErr) {
          console.warn("Wikipedia fetch error:", wikiErr);
        }
      }
    }

    // 4. AI Generated Visual (Pollinations Flux Engine - 100% Free)
    const aiSeed = Math.floor(Math.random() * 1000000);
    const aiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      cleanQuery + ", award-winning 4k documentary photography, cinematic lighting, historical archive painting, photorealistic"
    )}?width=1280&height=720&nologo=true&seed=${aiSeed}`;

    // Always append at least 2 AI generated options
    results.unshift({
      url: aiUrl,
      source: "ai",
      title: `IA Generativa: ${cleanQuery}`,
      thumbnail: aiUrl,
    });

    return NextResponse.json({
      query: cleanQuery,
      count: results.length,
      media: results,
    });
  } catch (err: unknown) {
    console.error("Media Search Error:", err);
    return NextResponse.json({ error: "Failed to search media" }, { status: 500 });
  }
}
