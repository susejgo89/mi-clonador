export type GenerationMode = "idea" | "voiceover";

export type DurationOption = "1" | "3" | "5" | "8" | "14" | "20" | "30" | "45" | "60";

export type VisualSourceMode = "auto" | "ai" | "wikimedia" | "pexels" | "pixabay" | "upload";

export interface Voice {
  id: string;
  name: string;
  gender: "male" | "female";
  accent: "American" | "British" | "Australian" | "Spanish (México)" | "Spanish (España)" | "Spanish (Argentina)";
  style: string;
  sampleText: string;
  edgeVoiceId: string;
  isFavorite?: boolean;
}

export interface StylePack {
  id: string;
  name: string;
  tag?: "PREMIUM" | "DEFAULT" | "NEW";
  description: string;
  colorScheme: string[];
  previewUrl: string;
}

export interface MusicPack {
  id: string;
  name: string;
  genre: string;
  tempo: string;
}

export type SubtitleStyle = "karaoke" | "word" | "box" | "clean" | "minimal";
export type SubtitleFont = "bebas_neue" | "poppins" | "lora" | "inter" | "roboto";

export interface VideoSettings {
  mode: GenerationMode;
  topic: string;
  audioFile?: string | null;
  duration: DurationOption;
  voice: Voice;
  stylePack: StylePack;
  music: MusicPack | "none";
  subtitlesOn: boolean;
  subtitleStyle: SubtitleStyle;
  subtitleFont: SubtitleFont;
  genThumbnail: boolean;
  thumbnailStyles: string[];
  visualSource: VisualSourceMode;
}

export interface VideoScene {
  id: number;
  text: string;
  visualKeyword: string;
  visualKeywords?: string[];
  durationSeconds: number;
  imageUrl?: string;
  imageUrls?: string[];
  videoUrl?: string;
  audioUrl?: string;
}

export interface GeneratedVideo {
  id: string;
  title: string;
  topic: string;
  durationMinutes: number;
  durationFormatted: string;
  createdAt: string;
  status: "ready" | "processing" | "failed";
  thumbnailUrl: string;
  aspectRatio: "16:9" | "9:16";
  voiceName: string;
  stylePackName: string;
  scriptSnippet: string;
  seoTags: string[];
  viewsCount?: number;
  videoBlobUrl?: string;
  scenes?: VideoScene[];
}

export interface AppApiKeys {
  geminiKey: string;
  pexelsKey: string;
  pixabayKey: string;
  elevenLabsKey: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  credits: number;
  minutesProduction: number;
  maxVideoDuration: number;
  concurrency: string;
  features: string[];
  popular?: boolean;
}
