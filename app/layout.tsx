import type { Metadata } from "next";
import { Geist_Mono, Orbitron, Space_Grotesk } from "next/font/google";

import { SiteHeader } from "@/components/navigation/site-header";
import "./globals.css";

const displayFont = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const monoFont = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gibe",
  description:
    "Generate playable browser games from natural language, repair runtime faults with AI, and publish shareable arcade links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full`}
    >
      <body className="min-h-full">
        <div className="fixed inset-0 -z-10 bg-app-gradient" />
        <div className="fixed inset-0 -z-10 bg-app-grid opacity-70" />
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}

