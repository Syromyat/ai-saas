'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PartnerDashboard() {
  const [partner, setPartner] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getPartnerData = async () => {
      const supabase = createClient();

      // Получаем текущего пользователя
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/partner/login');
        return;
      }
      setUser(authUser);

      // Получаем данные партнёра
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

      // Получаем статистику
      const { data: referrals } = await supabase
        .from('partner_referrals')
        .select('*')
        .eq('partner_id', partnerData.id);

      const { data: earnings } = await supabase
        .from('partner_earnings')
        .select('*')
        .eq('partner_id', partnerData.id);

      const totalLeads = referrals?.length || 0;
      const totalRegistered = referrals?.filter((r: any) => r.status !== 'lead').length || 0;
      const totalPaid = referrals?.filter((r: any) => r.status === 'paid').length || 0;
      const totalEarnings = earnings?.reduce((sum: number, e: any) => sum + (e.commission || 0), 0) || 0;
      const conversionRate = totalLeads > 0 ? ((totalPaid / totalLeads) * 100).toFixed(1) : 0;

      setStats({
        totalLeads,
        totalRegistered,
        totalPaid,
        totalEarnings,
        conversionRate,
        earnings,
      });

      setLoading(false);
    };

    getPartnerData();
  }, [router]);

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

  if (!partner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center">
        <p>Партнёр не найден</p>
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
            <h1 className="text-4xl font-bold mb-2">🤝 Партнёрский кабинет</h1>
            <p className="text-gray-400">Добро пожаловать, {partner.name || 'Партнёр'}!</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/partner/settings"
              className="px-6 py-3 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400/10 transition"
            >
              ⚙️ Настройки
            </Link>
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                router.push('/');
              }}
              className="px-6 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              🚪 Выход
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard icon="👥" label="Всего лидов" value={stats.totalLeads} color="text-blue-400" />
          <StatCard icon="✍️" label="Зарегистрировано" value={stats.totalRegistered} color="text-green-400" />
          <StatCard icon="💳" label="Оплачено" value={stats.totalPaid} color="text-purple-400" />
          <StatCard icon="📈" label="Конверсия" value={`${stats.conversionRate}%`} color="text-yellow-400" />
          <StatCard icon="💰" label="Заработок" value={`${stats.totalEarnings.toLocaleString()}₽`} color="text-emerald-400" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Реферальная ссылка */}
          <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6">🔗 Твоя реферальная ссылка</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Реферальный код</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={partner.referral_code}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg bg-slate-700/50 border border-blue-400/20 text-white"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(partner.referral_code)}
                    className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition font-semibold"
                  >
                    Копировать
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Полная ссылка</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`https://ai-saas-blue-zeta.vercel.app/?ref=${partner.referral_code}`}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg bg-slate-700/50 border border-blue-400/20 text-white text-sm"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(`https://ai-saas-blue-zeta.vercel.app/?ref=${partner.referral_code}`)}
                    className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition font-semibold"
                  >
                    Копировать
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-400/20">
                <p className="text-sm text-gray-400 mb-3">Комиссия: <span className="text-blue-400 font-bold">{partner.commission_percent}%</span></p>
                <p className="text-xs text-gray-500">от каждой оплаты твоего пользователя</p>
              </div>
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6">⚡ Быстрые ссылки</h2>
            
            <div className="space-y-3">
              <Link
                href="/partner/referrals"
                className="block p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition border border-blue-400/20"
              >
                <p className="font-semibold">👥 Мои лиды</p>
                <p className="text-xs text-gray-400">Список всех лидов</p>
              </Link>

              <Link
                href="/partner/earnings"
                className="block p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition border border-blue-400/20"
              >
                <p className="font-semibold">💰 Финансы</p>
                <p className="text-xs text-gray-400">Заработки и выплаты</p>
              </Link>

              <Link
                href="/partner/analytics"
                className="block p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition border border-blue-400/20"
              >
                <p className="font-semibold">📊 Аналитика</p>
                <p className="text-xs text-gray-400">Графики и статистика</p>
              </Link>

              <Link
                href="/partner/materials"
                className="block p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition border border-blue-400/20"
              >
                <p className="font-semibold">📦 Материалы</p>
                <p className="text-xs text-gray-400">Баннеры и тексты</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Earnings */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-6">💳 Последние начисления</h2>
          
          {stats.earnings && stats.earnings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-400/20">
                    <th className="text-left py-3 text-sm text-gray-400">Дата</th>
                    <th className="text-left py-3 text-sm text-gray-400">Пользователь</th>
                    <th className="text-left py-3 text-sm text-gray-400">Тариф</th>
                    <th className="text-left py-3 text-sm text-gray-400">Сумма</th>
                    <th className="text-left py-3 text-sm text-gray-400">Комиссия</th>
                    <th className="text-left py-3 text-sm text-gray-400">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.earnings.slice(-5).reverse().map((earning: any) => (
                    <tr key={earning.id} className="border-b border-blue-400/10 hover:bg-slate-700/30 transition">
                      <td className="py-3 text-sm">
                        {new Date(earning.created_at).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="py-3 text-sm text-gray-400">{earning.user_id?.substring(0, 8)}...</td>
                      <td className="py-3 text-sm">
                        <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs">
                          {earning.plan_type?.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-sm font-semibold">{earning.amount}₽</td>
                      <td className="py-3 text-sm text-green-400 font-semibold">+{earning.commission}₽</td>
                      <td className="py-3 text-sm">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          earning.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {earning.status === 'completed' ? '✓ Начислено' : '⏳ В ожидании'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">Начисления ещё отсутствуют</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 hover:border-blue-400/50 transition">
      <div className="text-3xl mb-3">{icon}</div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
