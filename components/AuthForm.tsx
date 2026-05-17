'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { generateReferralCode } from '@/lib/referral';

type Mode = 'login' | 'register';

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') ?? null;
  const next = searchParams.get('next') ?? '/dashboard';

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const supabase = createClient();

  async function handleSubmit() {
    setLoading(true);
    setMessage(null);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: 'error', text: 'Неверный email или пароль' });
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/api/auth/callback?next=${next}` },
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else if (data.user) {
        const myCode = generateReferralCode(data.user.id);
        await supabase.from('profiles').insert({
          id: data.user.id,
          email,
          referral_code: myCode,
          referred_by: refCode ?? null,
          plan: 'free',
          subscription_end: null,
        });

        if (refCode) {
          await supabase.from('referrals').insert({
            ref_code: refCode,
            invited_user_id: data.user.id,
            invited_email: email,
          });
        }

        setMessage({
          type: 'success',
          text: 'Подтвердите email — проверьте почту и нажмите ссылку.',
        });
      }
    }

    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/api/auth/callback?next=${next}` },
    });
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {/* Mode Toggle */}
      <div className="flex rounded-xl bg-slate-800/50 border border-blue-400/20 p-1 gap-1">
        {(['login', 'register'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setMessage(null);
            }}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
              mode === m
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {m === 'login' ? '🔐 Войти' : '✨ Регистрация'}
          </button>
        ))}
      </div>

      {/* Google Auth */}
      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-blue-400/20 bg-slate-900/50 hover:bg-slate-800/50 hover:border-blue-400/50 text-gray-300 hover:text-white text-sm font-semibold transition-all duration-300"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0" />
        <span className="text-xs text-gray-500">или</span>
        <div className="flex-1 h-px bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0" />
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-slate-900/50 border border-blue-400/20 focus:border-blue-400/50 focus:outline-none rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 transition-all duration-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-slate-900/50 border border-blue-400/20 focus:border-blue-400/50 focus:outline-none rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 transition-all duration-300"
          />
        </div>
      </div>

      {/* Referral Notice */}
      {refCode && mode === 'register' && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs">
          <p className="font-semibold mb-1">🎁 Реферальная ссылка</p>
          <p>Вы регистрируетесь по ссылке друга — они получат бонус после вашей первой оплаты.</p>
        </div>
      )}

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg text-sm font-semibold border ${
          message.type === 'error'
            ? 'bg-red-500/10 border-red-400/30 text-red-300'
            : 'bg-green-500/10 border-green-400/30 text-green-300'
        }`}>
          {message.type === 'error' ? '❌ ' : '✓ '}
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || !email || !password}
        className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Загрузка...
          </>
        ) : mode === 'login' ? (
          '🔐 Войти'
        ) : (
          '✨ Создать аккаунт'
        )}
      </button>
    </div>
  );
}
