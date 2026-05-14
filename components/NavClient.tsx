'use client';

import { useState } from 'react';
import Link from 'next/link';
import UserMenuServer from '@/components/UserMenuServer';

export default function NavClient() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Кабинет" },
    { href: "/history", label: "История" },
    { href: "/pricing", label: "Тарифы" },
    { href: "/referral", label: "Партнёрам 🎁" },
  ];

  return (
    <nav className="border-b border-zinc-800 px-4 md:px-6 py-4 sticky top-0 z-50 bg-zinc-950">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-[var(--font-display)] font-bold text-white text-lg tracking-tight">
          AI Tools
        </Link>

        {/* Десктоп меню */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
