'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import GeneratorForm from '@/components/GeneratorForm';
import Link from 'next/link';
import { BarChart2, CreditCard, Gift, Lightbulb, Zap } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white py-12 px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Добро пожаловать,{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {user?.email?.split('@')[0]}
                </span>
              </h1>
              <p className="text-gray-400">Выберите инструмент и опишите вашу задачу</p>
            </div>
            <div className="text-right">
              <div className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 mb-2">
                <p className="text-sm text-gray-400">Ваш тариф</p>
                <p className="text-lg font-bold capitalize bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {profile?.plan || 'free'}
                </p>
              </div>
            </div>
          </div>

          {profile?.plan === 'free' && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 flex justify-between items-center">
              <div>
                <p className="font-semibold mb-1">Хотите больше возможностей?</p>
                <p className="text-sm text-gray-400">Обновитесь на платный тариф для большего количества запросов</p>
              </div>
              <Link
                href="/pricing"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all whitespace-nowrap ml-4"
              >
                Обновить
              </Link>
            </div>
          )}
        </div>

        {/* Generator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Generator */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl hover:border-blue-400/50 transition-all">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-400" />
                AI Генератор
              </h2>
              <GeneratorForm />
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Usage Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20">
              <h3 className="font-bold mb-4">Использование сегодня</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Запросы</span>
                    <span className="text-blue-400">3/5</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-3/5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20">
              <h3 className="font-bold mb-4">Быстрые ссылки</h3>
              <div className="space-y-3">
                <Link
                  href="/history"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-blue-500/20 transition-all text-sm"
                >
                  <BarChart2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  История запросов
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-blue-500/20 transition-all text-sm"
                >
                  <CreditCard className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  Тарифы
                </Link>
                <Link
                  href="/referral"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-blue-500/20 transition-all text-sm"
                >
                  <Gift className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Реферальная программа
                </Link>
              </div>
            </div>

            {/* Tips Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/30">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Совет
              </h3>
              <p className="text-sm text-gray-300">
                Чем подробнее вы опишете задачу, тем качественнее результат получит AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
