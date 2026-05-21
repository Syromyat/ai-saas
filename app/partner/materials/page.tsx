'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PartnerMaterialsPage() {
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getPartner = async () => {
      const supabase = createClient();

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/partner/login');
        return;
      }

      const { data: partnerData } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (!partnerData) {
        router.push('/partner/register');
        return;
      }

      setPartner(partnerData);
      setLoading(false);
    };

    getPartner();
  }, [router]);

  const materials = [
    {
      id: 'banner-1',
      type: 'Баннер',
      title: 'Баннер 1 (728x90)',
      description: 'Стандартный баннер для сайтов',
      code: `<a href="https://ai-saas-blue-zeta.vercel.app/?ref=${partner?.referral_code}" target="_blank">
  <img src="https://ai-saas-blue-zeta.vercel.app/banner-728x90.png" alt="AI Tools" />
</a>`,
    },
    {
      id: 'banner-2',
      type: 'Баннер',
      title: 'Баннер 2 (300x250)',
      description: 'Квадратный баннер для боковых панелей',
      code: `<a href="https://ai-saas-blue-zeta.vercel.app/?ref=${partner?.referral_code}" target="_blank">
  <img src="https://ai-saas-blue-zeta.vercel.app/banner-300x250.png" alt="AI Tools" />
</a>`,
    },
    {
      id: 'text-1',
      type: 'Текст',
      title: 'Короткое описание',
      description: 'Краткое описание программы',
      code: `Присоединяйтесь к партнёрской программе AI Tools! Получайте 20% комиссию от каждого платежа ваших рефералов. Начните зарабатывать прямо сейчас!`,
    },
    {
      id: 'text-2',
      type: 'Текст',
      title: 'Подробное описание',
      description: 'Полное описание возможностей',
      code: `🚀 AI Tools - партнёрская программа

✓ 20% комиссия от каждого платежа
✓ Неограниченное количество лидов
✓ Реал-тайм аналитика
✓ Еженедельные выплаты
✓ Полная поддержка

Заработай с нами! https://ai-saas-blue-zeta.vercel.app/?ref=${partner?.referral_code}`,
    },
    {
      id: 'telegram',
      type: 'Сообщение',
      title: 'Telegram сообщение',
      description: 'Готовый текст для Telegram',
      code: `Привет! 👋

Нашёл отличный сервис для работы с ИИ - AI Tools. Помогает экономить время на текстах и анализе.

Там есть партнёрская программа - получаю 20% с каждой оплаты 💰

Если интересно, вот ссылка: https://ai-saas-blue-zeta.vercel.app/?ref=${partner?.referral_code}

Попробуй бесплатно! 🎁`,
    },
    {
      id: 'vk',
      type: 'Сообщение',
      title: 'ВКонтакте пост',
      description: 'Текст поста для ВК',
      code: `🤖 Попробуй AI Tools - помощника во всех делах!

Пишет тексты, анализирует информацию, помогает с идеями.

✨ Мне нравится, потому что:
✓ Работает быстро
✓ Результаты качественные
✓ Бесплатный пробный период

Вот моя ссылка: https://ai-saas-blue-zeta.vercel.app/?ref=${partner?.referral_code}

Используй её и получишь +20% бонусов 🎁

#AI #ИИ #AiTools #Заработок`,
    },
  ];

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  }

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
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">📦 Промо-материалы</h1>
            <p className="text-gray-400">Готовые материалы для продвижения</p>
          </div>
          <Link
            href="/partner/dashboard"
            className="px-6 py-3 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400/10 transition"
          >
            ← Назад
          </Link>
        </div>

        {/* Main Link */}
        <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">🔗 Твоя реферальная ссылка</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">Полная ссылка</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`https://ai-saas-blue-zeta.vercel.app/?ref=${partner?.referral_code}`}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-700/50 border border-blue-400/20 text-white text-sm"
                />
                <button
                  onClick={() =>
                    copyToClipboard(
                      `https://ai-saas-blue-zeta.vercel.app/?ref=${partner?.referral_code}`,
                      'main-link'
                    )
                  }
                  className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition font-semibold"
                >
                  {copied === 'main-link' ? '✓ Скопировано' : 'Копировать'}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-400/20">
              <p className="text-sm text-gray-400">
                Эта ссылка содержит твой реферальный код <span className="text-blue-400 font-bold">{partner?.referral_code}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Используй её в своих материалах для отслеживания лидов
              </p>
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 gap-6">
          {materials.map((material) => (
            <div
              key={material.id}
              className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-bold">
                      {material.type}
                    </span>
                    <h3 className="text-2xl font-bold">{material.title}</h3>
                  </div>
                  <p className="text-gray-400">{material.description}</p>
                </div>
              </div>

              {/* Code/Text Display */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Содержимое:</p>
                <div className="p-4 rounded-lg bg-slate-700/50 border border-blue-400/10 max-h-48 overflow-y-auto">
                  <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-words">
                    {material.code}
                  </pre>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(material.code, material.id)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  copied === material.id
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
                }`}
              >
                {copied === material.id ? '✓ Скопировано!' : '📋 Копировать'}
              </button>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-12 p-8 rounded-3xl border border-green-400/20 bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-4">💡 Советы по промоушену</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold mb-2">📱 Telegram</p>
              <p className="text-gray-400 text-sm">
                Делись в каналах, чатах и личных сообщениях. Лучше всего работают реальные истории о результатах.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">🔘 ВКонтакте</p>
              <p className="text-gray-400 text-sm">
                Постись в своей группе или на странице. Не забывай про хэштеги и интересные заголовки.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">📷 Instagram</p>
              <p className="text-gray-400 text-sm">
                Снимай сторис о том, как ты используешь AI Tools. Делись результатами и лайфхаками.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">▶️ YouTube</p>
              <p className="text-gray-400 text-sm">
                Сделай обзор в своём видео. Люди смотрят рекомендации блогеров - это сильный инструмент.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
