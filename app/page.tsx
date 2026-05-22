'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { initializeTracking } from '@/lib/partner-tracking';
import AppDownloadModal from '@/components/AppDownloadModal';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    initializeTracking();

    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      <AppDownloadModal />

      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Умные <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ИИ инструменты</span> для работы
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Генерируй тексты, анализируй информацию, создавай контент за секунды. Работает как мозг, думает как человек.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                >
                  📊 Личный кабинет
                </Link>
                <Link
                  href="/pricing"
                  className="px-12 py-4 border-2 border-blue-400 rounded-lg font-bold text-lg hover:bg-blue-400/10 transition"
                >
                  💳 Выбрать тариф
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                >
                  🚀 Начать бесплатно
                </Link>
                <Link
                  href="/pricing"
                  className="px-12 py-4 border-2 border-blue-400 rounded-lg font-bold text-lg hover:bg-blue-400/10 transition"
                >
                  💳 Тарифы
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          {[
            {
              icon: '✨',
              title: 'Быстро',
              description: 'Результаты за секунды',
            },
            {
              icon: '🎯',
              title: 'Точно',
              description: 'Высокое качество контента',
            },
            {
              icon: '🚀',
              title: 'Просто',
              description: 'Интуитивный интерфейс',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 hover:border-blue-400/50 transition text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="relative z-10 py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Простые <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">тарифы</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { name: 'СТАРТ', price: '0₽', features: ['5 запросов/день', 'История', '3 инструмента'] },
            { name: 'БАЗОВЫЙ', price: '299₽', features: ['100 запросов/день', 'История', 'Все инструменты'], popular: true },
            { name: 'PRO', price: '499₽', features: ['Безлимит', 'История', 'API доступ'] },
          ].map((plan, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-3xl ${
                plan.popular
                  ? 'md:scale-105 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-purple-400'
                  : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-xs font-bold">
                  🌟 Популярный
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {plan.price}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="text-gray-400">✓ {f}</li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-center font-bold hover:shadow-lg transition"
              >
                Выбрать
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-block px-12 py-4 border-2 border-blue-400 rounded-lg font-bold hover:bg-blue-400/10 transition"
          >
            Все тарифы
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-blue-400/10 text-center text-gray-400">
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <Link href="/pricing" className="hover:text-white transition">Тарифы</Link>
            <Link href="/partner" className="hover:text-white transition">Партнёрская программа</Link>
            <Link href="/login" className="hover:text-white transition">Вход</Link>
          </div>
        </div>
        <p>© 2026 AI Tools. Все права защищены.</p>
      </footer>
    </div>
  );
}
