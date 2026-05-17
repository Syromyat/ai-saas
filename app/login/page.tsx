'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center px-6 py-12">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              IAPRO
            </h1>
            <p className="text-sm text-gray-400 mt-2">AI инструменты нового поколения</p>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-2 text-center">
            {isLogin ? 'Добро пожаловать' : 'Создать аккаунт'}
          </h2>
          <p className="text-center text-gray-400 mb-8">
            {isLogin 
              ? 'Войдите в ваш аккаунт' 
              : 'Создайте новый аккаунт для начала работы'}
          </p>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-blue-400/20 focus:border-blue-400/50 focus:outline-none transition-all text-white placeholder-gray-500"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-blue-400/20 focus:border-blue-400/50 focus:outline-none transition-all text-white placeholder-gray-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading 
                ? isLogin ? 'Загрузка...' : 'Регистрация...'
                : isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="text-center mt-6 pt-6 border-t border-blue-400/10">
            <p className="text-gray-400 text-sm">
              {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold transition"
              >
                {isLogin ? 'Создать' : 'Войти'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>Продолжая, вы соглашаетесь с</p>
          <p className="mt-1">
            <Link href="#" className="hover:text-blue-400 transition">Условиями использования</Link>
            {' '} и{' '}
            <Link href="#" className="hover:text-blue-400 transition">Политикой конфиденциальности</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
