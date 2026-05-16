'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Логотип */}
        <Link href="/" className="text-2xl font-bold text-purple-500">
          AI Tools
        </Link>

        {/* Десктоп меню */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/dashboard" className="hover:text-purple-400">
            Кабинет
          </Link>
          <Link href="/pricing" className="hover:text-purple-400">
            Тарифы
          </Link>
          <Link href="/history" className="hover:text-purple-400">
            История
          </Link>
          <Link href="/referral" className="hover:text-purple-400">
            Партнёрам
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Выход
          </button>
        </div>

        {/* Мобильное меню (бургер) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Выпадающее мобильное меню */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col gap-4 p-4">
            <Link
              href="/dashboard"
              className="block py-2 hover:text-purple-400"
              onClick={() => setIsOpen(false)}
            >
              Кабинет
            </Link>
            <Link
              href="/pricing"
              className="block py-2 hover:text-purple-400"
              onClick={() => setIsOpen(false)}
            >
              Тарифы
            </Link>
            <Link
              href="/history"
              className="block py-2 hover:text-purple-400"
              onClick={() => setIsOpen(false)}
            >
              История
            </Link>
            <Link
              href="/referral"
              className="block py-2 hover:text-purple-400"
              onClick={() => setIsOpen(false)}
            >
              Партнёрам
            </Link>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-left"
            >
              Выход
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
