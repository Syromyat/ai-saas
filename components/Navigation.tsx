'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Zap, CreditCard, Users, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';

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
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          <Zap className="w-6 h-6 text-blue-400" />
          AI Tools
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/pricing" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <CreditCard className="w-4 h-4" />
            Тарифы
          </Link>
          <Link href="/partner" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <Users className="w-4 h-4" />
            Партнёры
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <LayoutDashboard className="w-4 h-4" />
                Кабинет
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
              >
                <LogOut className="w-4 h-4" />
                Выход
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:shadow-lg transition"
            >
              Вход
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-blue-400/10">
          <div className="flex flex-col gap-4 p-6">
            <Link href="/pricing" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
              <CreditCard className="w-4 h-4" />
              Тарифы
            </Link>
            <Link href="/partner" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
              <Users className="w-4 h-4" />
              Партнёры
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                  <LayoutDashboard className="w-4 h-4" />
                  Кабинет
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Выход
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-center hover:shadow-lg transition"
              >
                Вход
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
