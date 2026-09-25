import type { Metadata } from "next";
import { Inter, Bebas_Neue, Poppins, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const lora = Lora({
  weight: ["500", "600", "700"],
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kutly | AI YouTube Video Generator. One Prompt, Long-Form Videos",
  description: "Kutly turns one prompt into a finished faceless YouTube video — script, AI voiceover, footage, motion design, thumbnail and SEO. 8 to 30 minutes.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${poppins.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0E0C0B] text-[#FAFAF7]">
        {children}
      </body>
    </html>
  );
}
