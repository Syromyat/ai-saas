'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ReferralPage() {
  const [user, setUser] = useState<any>(null);
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('referral_code')
          .eq('id', user.id)
          .single();

        if (profile?.referral_code) {
          setReferralCode(profile.referral_code);
        }

        // Get referral count
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('referred_by', profile?.referral_code);

        setReferrals(count || 0);
        setEarnings(count ? count * 50 : 0); // 50 рублей за реферала
      }
    };

    getUser();
  }, []);

  const referralLink = `https://www.iapro.ru?ref=${referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white py-12 px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Зарабатывайте с <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">IAPRO</span>
          </h1>
          <p className="text-xl text-gray-400">Приглашайте друзей и получайте 50₽ за каждого</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Referrals Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-gray-400">Друзей приглашено</h3>
              <span className="text-3xl">👥</span>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {referrals}
            </div>
            <p className="text-gray-400 mt-2">активных рефералов</p>
          </div>

          {/* Earnings Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-purple-400 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-gray-400">Ваш доход</h3>
              <span className="text-3xl">💰</span>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {earnings}₽
            </div>
            <p className="text-gray-400 mt-2">за все время</p>
          </div>

          {/* Rate Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-gray-400">За каждого друга</h3>
              <span className="text-3xl">🎁</span>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              50₽
            </div>
            <p className="text-gray-400 mt-2">при первой покупке</p>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="mb-16">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6">Ваша реферальная ссылка</h2>
            
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-6 py-3 rounded-lg bg-slate-900/50 border border-blue-400/20 text-gray-300 font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(referralLink)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all whitespace-nowrap"
              >
                {copied ? '✓ Скопирована' : '📋 Копировать'}
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-400">
              <p>💡 Поделитесь этой ссылкой с друзьями в:</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => copyToClipboard(`Привет! Вот крутой AI сервис для работы: ${referralLink}`)} className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition">
                  Telegram
                </button>
                <button onClick={() => copyToClipboard(`Рекомендую всем IAPRO - ${referralLink}`)} className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition">
                  WhatsApp
                </button>
                <button onClick={() => copyToClipboard(`Обнаружил крутой сервис ${referralLink}`)} className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition">
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Поделитесь ссылкой', desc: 'Отправьте реферальную ссылку друзьям' },
              { step: 2, title: 'Друг регистрируется', desc: 'Ваш друг переходит и создаёт аккаунт' },
              { step: 3, title: 'Первая покупка', desc: 'Друг выбирает платный тариф' },
              { step: 4, title: 'Получайте доход', desc: 'Вы получаете 50₽ на счёт' },
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/30">
          <h2 className="text-2xl font-bold mb-6">Дополнительные привилегии</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h4 className="font-bold">Безлимитные рефералы</h4>
                <p className="text-gray-400 text-sm">Нет лимита на количество приглашённых друзей</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <h4 className="font-bold">Мгновенная выплата</h4>
                <p className="text-gray-400 text-sm">Деньги поступают на счёт в течение 24 часов</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-bold">Подробная статистика</h4>
                <p className="text-gray-400 text-sm">Отслеживайте всех своих рефералов в реальном времени</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h4 className="font-bold">Бонусные программы</h4>
                <p className="text-gray-400 text-sm">Дополнительные награды за активность</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">Не зарегистрированы? Создайте аккаунт прямо сейчас</p>
          <Link href="/login" className="inline-block px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105">
            Начать зарабатывать
          </Link>
        </div>
      </div>
    </div>
  );
}
