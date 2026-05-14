import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import NavClient from "@/components/NavClient";

const syne = Syne({ subsets: ["latin", "latin-ext"], variable: "--font-display", weight: ["400","500","700"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "AI Tools — Умные инструменты",
  description: "ИИ-инструменты для работы, бизнеса и творчества",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-zinc-950 font-[var(--font-body)] antialiased">
        <NavClient />
        {children}
      </body>
    </html>
  );
}
