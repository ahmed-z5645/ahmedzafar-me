import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import KeyWatcher from "./components/logic/keyWatcher";
import "./globals.css";
import Cursor from "../app/components/cursor";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Ahmed Zafar | Software + Biomedical Engineer",
  description: "Software + Biomedical Engineer. Building at the intersection of computation and biology.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Ahmed Zafar",
    description: "Software + Biomedical Engineer. Building at the intersection of computation and biology.",
    url: "https://ahmedzafar.me",
    siteName: "Ahmed Zafar",
    images: [{ url: "https://ahmedzafar.me/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Zafar",
    description: "Software + Biomedical Engineer. Building at the intersection of computation and biology.",
    images: ["https://ahmedzafar.me/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} antialiased`}
        suppressHydrationWarning
      >
        <Cursor />
        <KeyWatcher />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
