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
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-blue-400/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all">
            IAPRO
          </div>
          <span className="hidden sm:block text-xs text-gray-400">AI инструменты</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/" className="text-gray-300 hover:text-blue-400 transition">
            Главная
          </Link>
          <Link href="#features" className="text-gray-300 hover:text-blue-400 transition">
            Возможности
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-blue-400 transition">
            Тарифы
          </Link>
          <Link href="#" className="text-gray-300 hover:text-blue-400 transition">
            Контакты
          </Link>

          {/* Auth Buttons */}
          <div className="flex gap-2 ml-4 pl-4 border-l border-blue-400/20">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-300 hover:text-red-400 transition"
            >
              Выход
            </button>
            <Link 
              href="/login"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105"
            >
              Вход
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl text-gray-300 hover:text-blue-400 transition"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-blue-400/10 px-4 py-6">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-gray-300 hover:text-blue-400 transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Главная
            </Link>
            <Link
              href="#features"
              className="text-gray-300 hover:text-blue-400 transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Возможности
            </Link>
            <Link
              href="/pricing"
              className="text-gray-300 hover:text-blue-400 transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Тарифы
            </Link>
            <Link
              href="#"
              className="text-gray-300 hover:text-blue-400 transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Контакты
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-blue-400/10">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-gray-300 hover:text-red-400 transition text-left"
              >
                Выход
              </button>
              <Link 
                href="/login"
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold text-center hover:shadow-lg hover:shadow-blue-500/50 transition"
              >
                Вход
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
