'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { initializeTracking, saveReferralToDatabase } from '@/lib/partner-tracking';
import { Zap, Mail, Lock, LogIn, UserPlus, ArrowLeft, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    initializeTracking();
  }, []);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      const userId = authData.user?.id;
      if (!userId) {
        setError('Ошибка создания аккаунта');
        setLoading(false);
        return;
      }

      await saveReferralToDatabase(supabase, userId, email);

      const referralCode = `user_${Math.random().toString(36).substring(2, 10)}`;
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        email,
        plan: 'free',
        referral_code: referralCode,
      });

      if (profileError) {
        console.error('Ошибка создания профиля:', profileError);
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError('Ошибка: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

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

      router.push('/dashboard');
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
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-3xl font-bold mb-2">
            <Zap className="w-8 h-8 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Tools
            </span>
          </div>
          <p className="text-gray-400">
            {mode === 'login' ? 'Вход в аккаунт' : 'Создание аккаунта'}
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
          <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-blue-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                Пароль
              </label>
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
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'login' ? 'Вход...' : 'Регистрация...'}
                </>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Войти
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Создать аккаунт
                </>
              )}
            </button>

            {/* Mode Toggle */}
            <div className="text-center text-sm text-gray-400">
              {mode === 'login' ? (
                <>
                  Нет аккаунта?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    Зарегистрироваться
                  </button>
                </>
              ) : (
                <>
                  Уже есть аккаунт?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    Войти
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
