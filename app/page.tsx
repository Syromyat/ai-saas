'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    { icon: '✍️', title: 'ИИ Резюме', desc: 'Создавайте профессиональное резюме за минуту' },
    { icon: '📝', title: 'ИИ Контент', desc: 'Напишите статьи, посты и рассказы' },
    { icon: '🎉', title: 'Поздравления', desc: 'Оригинальные поздравления для любого случая' },
    { icon: '💡', title: 'Бизнес идеи', desc: 'Найдите свою нишу для заработка' },
    { icon: '⚖️', title: 'Юридическая помощь', desc: 'Ответы на правовые вопросы' },
    { icon: '🎓', title: 'ИИ Репетитор', desc: 'Объяснение любой темы' },
  ];

  const benefits = [
    { icon: '⚡', title: 'Скорость', desc: 'Результаты за секунды' },
    { icon: '🛡️', title: 'Надёжность', desc: '99.9% uptime гарантия' },
    { icon: '🤖', title: 'AI Automation', desc: 'Полная автоматизация' },
    { icon: '💰', title: 'Доступность', desc: 'Цены для всех' },
  ];

  const pricingPlans = [
    { name: 'FREE', price: '0₽', requests: '5 запросов/день', features: ['3 инструмента', 'История'] },
    { name: 'BASIC', price: '299₽', requests: '100 запросов/день', features: ['Все инструменты', 'История', 'Приоритет'], popular: true },
    { name: 'PRO', price: '499₽', requests: 'Безлимит', features: ['Все инструменты', 'История', 'Приоритет', 'API доступ'] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  ИИ-инструменты для <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">работы и жизни</span>
                </h1>
                <p className="text-xl text-gray-300">Все возможности искусственного интеллекта в одном сервисе. Экономьте время, повышайте продуктивность, достигайте целей.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105">
                  Попробовать бесплатно
                </Link>
                <Link href="#features" className="px-8 py-4 border-2 border-blue-400 rounded-lg font-semibold hover:bg-blue-400/10 transition-all">
                  Смотреть возможности
                </Link>
              </div>

              <div className="flex flex-col gap-3 text-sm text-gray-400">
                <div>✨ ИИ работает 24/7 для вас</div>
                <div>⚡ Экономьте часы вашего времени</div>
                <div>🚀 100+ AI функций в одном месте</div>
              </div>
            </div>

            {/* Right Side - Dashboard Preview */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-blue-400/20 shadow-2xl shadow-blue-500/20 p-6 backdrop-blur-xl">
                <div className="space-y-4">
                  <div className="h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/10 animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Что умеет IAPRO</h2>
              <p className="text-gray-400 text-lg">Полный набор AI-инструментов для решения любых задач</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl hover:border-purple-400/50 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                  {hoveredCard === idx && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US SECTION */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Почему выбирают IAPRO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-400/20 text-center">
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Простые тарифы</h2>
              <p className="text-gray-400 text-lg">Начните бесплатно, улучшайте когда нужно</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`relative p-8 rounded-3xl backdrop-blur-xl transition-all transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-2 border-purple-400 shadow-2xl shadow-purple-500/30 lg:scale-105'
                      : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20'
                  }`}
                >
                  {plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-bold">Популярный</div>}
                  
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">{plan.price}</div>
                  <p className="text-gray-400 mb-6">{plan.requests}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <span className="text-blue-400">✓</span> {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href="/login" className={`block text-center py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-2xl hover:shadow-purple-500/50'
                      : 'border border-blue-400 hover:bg-blue-400/10'
                  }`}>
                    Начать
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Попробуйте будущее уже сегодня</h2>
            <p className="text-xl text-gray-400 mb-8">Присоединитесь к тысячам пользователей, которые уже экономят время с помощью IAPRO</p>
            <Link href="/login" className="inline-block px-12 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105">
              Перейти на платформу
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-blue-400/10 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-bold mb-4">IAPRO</h4>
                <p className="text-gray-400 text-sm">Интеллектуальные инструменты нового поколения</p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Продукт</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li><Link href="#" className="hover:text-white transition">Возможности</Link></li>
                  <li><Link href="/pricing" className="hover:text-white transition">Тарифы</Link></li>
                  <li><Link href="#" className="hover:text-white transition">API</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Компания</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li><Link href="#" className="hover:text-white transition">О нас</Link></li>
                  <li><Link href="#" className="hover:text-white transition">Контакты</Link></li>
                  <li><Link href="#" className="hover:text-white transition">Блог</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Соцсети</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li><Link href="#" className="hover:text-white transition">Telegram</Link></li>
                  <li><Link href="#" className="hover:text-white transition">Twitter</Link></li>
                  <li><Link href="#" className="hover:text-white transition">GitHub</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-blue-400/10 pt-8 text-center text-gray-400 text-sm">
              <p>© 2025 IAPRO. Все права защищены.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
