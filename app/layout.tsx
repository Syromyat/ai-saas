'use client';

import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import { useState } from "react";

const syne = Syne({ subsets: ["latin", "latin-ext"], variable: "--font-display", weight: ["400","500","700"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "AI Tools — Умные инструменты",
  description: "ИИ-инструменты для работы, бизнеса и творчества",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="ru" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-zinc-950 font-[var(--font-body)] antialiased">
        <nav className="border-b border-zinc-800 px-4 md:px-6 py-4 sticky top-0 z-50 bg-zinc-950">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-[var(--font-display)] font-bold text-white text-lg tracking-tight">
              AI Tools
            </Link>

            {/* Десктоп меню */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Кабинет
              </Link>
              <Link href="/history" className="text-sm text-zinc-400 hover:text-white transition-colors">
                История
              </Link>
              <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Тарифы
              </Link>
              <Link href="/referral" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Партнёрам 🎁
              </Link>
              <UserMenu />
            </div>

            {/* Мобильное меню - бургер */}
            <div className="md:hidden flex items-center gap-4">
              <UserMenu />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white text-2xl p-2 hover:bg-zinc-800 rounded transition-colors"
              >
                {isOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* Выпадающее мобильное меню */}
          {isOpen && (
            <div className="md:hidden border-t border-zinc-800 mt-4 pt-4 space-y-3">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              >
                Кабинет
              </Link>
              <Link
                href="/history"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              >
                История
              </Link>
              <Link
                href="/pricing"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              >
                Тарифы
              </Link>
              <Link
                href="/referral"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              >
                Партнёрам 🎁
              </Link>
            </div>
          )}
        </nav>
        {children}
      </body>
    </html>
  );
}
