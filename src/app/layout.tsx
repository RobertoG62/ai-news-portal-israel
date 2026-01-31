import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Pulse Israel | מקור החדשות המוביל שלך לבינה מלאכותית",
  description: "הישארו בחזית עם החדשות, התובנות והניתוחים העדכניים ביותר מ-OpenAI, Anthropic, NVIDIA ועוד. המנה היומית שלכם של עדכוני בינה מלאכותית.",
  keywords: "חדשות AI, בינה מלאכותית, OpenAI, Anthropic, NVIDIA, Claude, GPT, למידת מכונה",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="dark">
      <body
        className={`${assistant.variable} ${geistMono.variable} antialiased hebrew-text`}
      >
        {children}
      </body>
    </html>
  );
}
