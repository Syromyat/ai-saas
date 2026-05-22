'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-blue-400/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          🚀 AI Tools
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/pricing" className="text-gray-400 hover:text-white transition">
            💳 Тарифы
          </Link>
          <Link href="/partner/register" className="text-gray-400 hover:text-white transition">
            🤝 Партнёры
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                📊 Кабинет
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
              >
                🚪 Выход
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:shadow-lg transition"
            >
              ✓ Вход
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white text-2xl"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-blue-400/10">
          <div className="flex flex-col gap-4 p-6">
            <Link href="/pricing" className="text-gray-400 hover:text-white transition">
              💳 Тарифы
            </Link>
            <Link href="/partner/register" className="text-gray-400 hover:text-white transition">
              🤝 Партнёры
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                  📊 Кабинет
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                >
                  🚪 Выход
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-center hover:shadow-lg transition"
              >
                ✓ Вход
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
