'use client';

import Link from 'next/link';

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white py-20 px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">🤝 Партнёрская программа</h1>
          <p className="text-xl text-gray-400">
            Получай <span className="text-emerald-400 font-bold">20% комиссию</span> от каждой оплаты твоих рефералов
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-400/30 text-center">
            <p className="text-5xl font-bold text-emerald-400 mb-3">20%</p>
            <p className="text-gray-400 text-lg">Комиссия</p>
            <p className="text-sm text-gray-500 mt-2">От каждого платежа</p>
          </div>
          <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-400/30 text-center">
            <p className="text-5xl font-bold text-emerald-400 mb-3">∞</p>
            <p className="text-gray-400 text-lg">Нет лимитов</p>
            <p className="text-sm text-gray-500 mt-2">Зарабатывай столько, сколько хочешь</p>
          </div>
          <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-400/30 text-center">
            <p className="text-5xl font-bold text-emerald-400 mb-3">⚡</p>
            <p className="text-gray-400 text-lg">Еженедельно</p>
            <p className="text-sm text-gray-500 mt-2">Выплаты каждую неделю</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            href="/partner/register"
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg font-bold text-lg text-white hover:shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-105 text-center"
          >
            🚀 Начать зарабатывать
          </Link>
          <Link
            href="/partner/login"
            className="px-8 py-4 border-2 border-emerald-400 text-emerald-400 rounded-lg font-bold text-lg hover:bg-emerald-400/10 transition text-center"
          >
            🔐 Уже партнёр? Войти
          </Link>
        </div>

        {/* How it works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Как это работает?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                num: '1',
                title: 'Регистрация',
                description: 'Создай аккаунт партнёра за 2 минуты',
              },
              {
                num: '2',
                title: 'Получи ссылку',
                description: 'Скопируй свою реферальную ссылку',
              },
              {
                num: '3',
                title: 'Делись везде',
                description: 'Поделись в социальных сетях, блоге, чате',
              },
              {
                num: '4',
                title: 'Получай доход',
                description: '20% от каждой оплаты твоего реферала',
              },
            ].map((step, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center font-bold text-lg mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Что ты получаешь?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '📊',
                title: 'Real-time аналитика',
                description: 'Видишь все свои лиды, продажи и доход в реальном времени',
              },
              {
                icon: '💰',
                title: 'Автоматические начисления',
                description: 'Комиссия начисляется автоматически при каждом платеже',
              },
              {
                icon: '🏦',
                title: 'Гибкие выплаты',
                description: 'Выводи заработок на карту, крипто или счёт',
              },
              {
                icon: '📱',
                title: 'Личный кабинет',
                description: 'Удобная панель с графиками, отчётами и материалами',
              },
              {
                icon: '🎁',
                title: 'Промо-материалы',
                description: 'Готовые баннеры, тексты и сообщения для продвижения',
              },
              {
                icon: '🚀',
                title: 'Неограниченный доход',
                description: 'Нет потолка на количество лидов и комиссию',
              },
            ].map((benefit, i) => (
              <div key={i} className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 hover:border-blue-400/50 transition">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Example */}
        <div className="mb-20 p-12 rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-400/30">
          <h2 className="text-3xl font-bold text-center mb-12">Примеры заработков</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                users: 10,
                basic: 299,
                pro: 499,
              },
              {
                users: 50,
                basic: 1495,
                pro: 2495,
              },
              {
                users: 100,
                basic: 2990,
                pro: 4990,
              },
            ].map((example, i) => (
              <div key={i} className="p-6 rounded-xl bg-slate-800/50 border border-blue-400/20">
                <h3 className="text-2xl font-bold mb-4">{example.users} рефералов</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Если {example.users}% выберут БАЗОВЫЙ</p>
                    <p className="text-3xl font-bold text-emerald-400">
                      {(example.users * example.basic * 0.2 * 0.01).toLocaleString()}₽
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Если {example.users}% выберют PRO</p>
                    <p className="text-3xl font-bold text-emerald-400">
                      {(example.users * example.pro * 0.2 * 0.01).toLocaleString()}₽
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 mt-8 text-sm">
            * Примеры рассчитаны на 1% конверсию. Ваш доход может быть выше!
          </p>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Часто задаваемые вопросы</h2>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: 'Сколько стоит присоединиться?',
                a: 'Совершенно бесплатно! Регистрация, использование кабинета и аналитика — всё без вложений.',
              },
              {
                q: 'Как быстро я начну получать доход?',
                a: 'Комиссия начисляется сразу после оплаты пользователя. Выплаты происходят еженедельно по понедельникам.',
              },
              {
                q: 'Какой минимум для вывода?',
                a: 'Минимум для вывода составляет 100₽. Выводить можно на карту, крипто-кошелёк или банковский счёт.',
              },
              {
                q: 'Могу ли я изменить способ продвижения?',
                a: 'Да, ты полностью свободен в выборе способов продвижения. Используй наши материалы или создавай свои.',
              },
              {
                q: 'Есть ли лимит на количество рефералов?',
                a: 'Нет никаких лимитов! Зарабатывай столько, сколько захочешь.',
              },
              {
                q: 'Как поддерживается программа?',
                a: 'У нас есть Telegram канал поддержки. Любые вопросы — и мы поможем в течение часа.',
              },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-slate-800/50 border border-blue-400/20 hover:border-blue-400/50 transition">
                <h3 className="font-bold text-lg mb-2 text-blue-400">{item.q}</h3>
                <p className="text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center p-12 rounded-3xl bg-gradient-to-r from-emerald-900/30 to-green-900/30 border border-emerald-400/30">
          <h2 className="text-3xl font-bold mb-4">Готов начать зарабатывать?</h2>
          <p className="text-gray-400 mb-8">Присоединись к сотням партнёров которые уже зарабатывают с AI Tools</p>
          <Link
            href="/partner/register"
            className="inline-block px-12 py-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-105"
          >
            🚀 Начать прямо сейчас
          </Link>
        </div>
      </div>
    </div>
  );
}
