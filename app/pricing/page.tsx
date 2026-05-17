'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import BuyButton from '@/components/BuyButton';

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setCurrentPlan(profile.plan || 'free');
        }
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const plans = [
    {
      name: 'СТАРТ',
      price: '0',
      description: 'Идеально для пробы',
      requests: '5 запросов/день',
      planId: null as null,
      features: [
        '✓ 5 запросов в день',
        '✓ 3 инструмента',
        '✓ История запросов',
        '✗ Приоритет',
        '✗ API доступ'
      ],
      popular: false
    },
    {
      name: 'БАЗОВЫЙ',
      price: '299',
      description: 'Для активных пользователей',
      requests: '100 запросов/день',
      planId: 'basic' as const,
      features: [
        '✓ 100 запросов в день',
        '✓ Все инструменты',
        '✓ История запросов',
        '✓ Приоритет',
        '✗ API доступ'
      ],
      popular: true
    },
    {
      name: 'PRO',
      price: '499',
      description: 'Для профессионалов',
      requests: 'Безлимитные запросы',
      planId: 'pro' as const,
      features: [
        '✓ Безлимитные запросы',
        '✓ Все инструменты',
        '✓ История запросов',
        '✓ Приоритет',
        '✓ API доступ'
      ],
      popular: false
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white py-20 px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl lg:text-6xl font-bold mb-4">
            Простые и честные <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">тарифы</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Начните бесплатно. Деньги платите только когда нужно больше возможностей.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative group rounded-3xl overflow-hidden transition-all transform hover:scale-105 ${
                plan.popular
                  ? 'md:scale-105 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-purple-400 shadow-2xl shadow-purple-500/30'
                  : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 hover:border-blue-400/50'
              }`}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>

              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-xs font-bold shadow-lg z-50 whitespace-nowrap">
                  🌟 Популярный
                </div>
              )}

              <div className="relative z-10 p-8 backdrop-blur-xl">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6 text-sm">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {plan.price}₽
                  </div>
                  <p className="text-gray-400">в месяц</p>
                  <p className="text-sm text-blue-400 mt-2">{plan.requests}</p>
                </div>

                {/* CTA Button */}
                <div className="mb-8">
                  <BuyButton 
                    planId={plan.planId} 
                    currentPlan={currentPlan}
                    planName={plan.name}
                  />
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300">
                      <span className={feature.includes('✓') ? 'text-blue-400' : 'text-gray-600'}>
                        {feature.split(' ')[0]}
                      </span>
                      <span>{feature.substring(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Часто задаваемые вопросы</h2>
          
          <div className="space-y-6">
            {[
              { q: 'Могу ли я отменить подписку?', a: 'Да, отмену можно сделать в любой момент в личном кабинете без штрафов.' },
              { q: 'Как я буду платить?', a: 'Мы принимаем платежи через ЮKassa: карты, электронные кошельки и мобильные платежи.' },
              { q: 'Есть ли пробный период?', a: 'Да! Начните с бесплатного плана и попробуйте все возможности без ограничений.' },
              { q: 'Можно ли увеличить лимиты?', a: 'Конечно! Просто выберите более высокий тариф в любой момент. Переплата не будет.' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-slate-800/50 border border-blue-400/20 hover:border-blue-400/50 transition-all">
                <h4 className="font-bold mb-2 text-blue-400">{item.q}</h4>
                <p className="text-gray-300">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="text-center mt-20">
          <h3 className="text-2xl font-bold mb-4">Готовы начать?</h3>
          <p className="text-gray-400 mb-8">Присоединитесь к тысячам пользователей уже сегодня</p>
          <Link href="/login" className="inline-block px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105">
            Начать бесплатно
          </Link>
        </div>
      </div>
    </div>
  );
}
