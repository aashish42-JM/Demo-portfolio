import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AashishOS v1.0 — Aashish Timalsina",
  description:
    "The Digital Operating System of Aashish Timalsina — BSc CSIT Student, AI Enthusiast, Full Stack Learner from Lalitpur, Nepal. Explore projects, skills, and chat with an AI version of Aashish.",
  keywords: [
    "Aashish Timalsina",
    "portfolio",
    "BSc CSIT",
    "AI developer",
    "Nepal",
    "full stack",
    "Career-Tantra",
  ],
  authors: [{ name: "Aashish Timalsina", url: "https://github.com/aashish42-JM" }],
  openGraph: {
    title: "AashishOS v1.0 — Aashish Timalsina",
    description: "An OS-themed interactive portfolio experience. Boot into AashishOS.",
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#050816] text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
