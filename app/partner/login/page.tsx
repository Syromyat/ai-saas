'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PartnerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      router.push('/partner/dashboard');

    } catch (err: any) {
      setError('Ошибка: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center px-6 py-20">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🤝 Вход партнёра</h1>
          <p className="text-gray-400">Управляй своей программой</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@example.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-blue-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-blue-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Вход...
                </>
              ) : (
                '✓ Войти'
              )}
            </button>

            {/* Link to Register */}
            <div className="text-center text-sm text-gray-400">
              Нет аккаунта?{' '}
              <Link href="/partner/register" className="text-blue-400 hover:text-blue-300">
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-gray-400 hover:text-white transition">
            ← На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
