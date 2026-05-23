'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PartnerRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [telegram, setTelegram] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

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

      await new Promise(resolve => setTimeout(resolve, 2000));

      const referralCode = `partner_${Math.random().toString(36).substring(2, 10)}`;

      const { error: partnerError } = await supabase.from('partners').insert({
        user_id: userId,
        email,
        name,
        telegram,
        referral_code: referralCode,
        commission_percent: 20,
      });

      if (partnerError) {
        setError('Ошибка регистрации партнёра: ' + partnerError.message);
        setLoading(false);
        return;
      }

      setSuccess('✅ Регистрация успешна! Перенаправляем...');
      
      setTimeout(() => {
        router.push('/partner/login');
      }, 2000);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError('Ошибка: ' + message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center px-6 py-20">
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🤝 Партнёрская программа</h1>
          <p className="text-gray-400">Заработай с IAPRO</p>
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
          <form onSubmit={handleRegister} className="space-y-6">
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

            <div>
              <label className="block text-sm font-semibold mb-2">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-blue-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Telegram (@username)</label>
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@yourname"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-blue-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition"
              />
            </div>

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

            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 rounded-lg bg-green-500/20 border border-green-400/30 text-green-300 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Регистрация...
                </>
              ) : (
                '✓ Зарегистрироваться'
              )}
            </button>

            <div className="text-center text-sm text-gray-400">
              Уже есть аккаунт?{' '}
              <Link href="/partner/login" className="text-blue-400 hover:text-blue-300">
                Войти
              </Link>
            </div>
          </form>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-400 hover:text-white transition">
            ← На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
