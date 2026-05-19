'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PartnerAnalyticsPage() {
  const [partner, setPartner] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const router = useRouter();

  useEffect(() => {
    const getAnalyticsData = async () => {
      const supabase = createClient();

      // Получаем текущего пользователя
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/partner/login');
        return;
      }

      // Получаем партнёра
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

      // Получаем лиды
      const { data: referralsData } = await supabase
        .from('partner_referrals')
        .select('*')
        .eq('partner_id', partnerData.id)
        .order('created_at', { ascending: false });

      setReferrals(referralsData || []);

      // Получаем заработки
      const { data: earningsData } = await supabase
        .from('partner_earnings')
        .select('*')
        .eq('partner_id', partnerData.id)
        .order('created_at', { ascending: false });

      setEarnings(earningsData || []);
      setLoading(false);
    };

    getAnalyticsData();
  }, [router]);

  // Группируем лиды по дням
  const getLeadsByDay = () => {
    const days: Record<string, number> = {};
    referrals.forEach((ref) => {
      const date = new Date(ref.created_at).toLocaleDateString('ru-RU');
      days[date] = (days[date] || 0) + 1;
    });
    return Object.entries(days)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-7);
  };

  // Группируем заработки по дням
  const getEarningsByDay = () => {
    const days: Record<string, number> = {};
    earnings.forEach((earning) => {
      const date = new Date(earning.created_at).toLocaleDateString('ru-RU');
      days[date] = (days[date] || 0) + (earning.commission || 0);
    });
    return Object.entries(days)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-7);
  };

  // Источники трафика
  const getSourcesStats = () => {
    const sources: Record<string, { leads: number; paid: number }> = {};
    referrals.forEach((ref) => {
      const source = ref.source || 'other';
      if (!sources[source]) {
        sources[source] = { leads: 0, paid: 0 };
      }
      sources[source].leads += 1;
      if (ref.status === 'paid') {
        sources[source].paid += 1;
      }
    });
    return sources;
  };

  const leadsData = getLeadsByDay();
  const earningsData = getEarningsByDay();
  const sourcesData = getSourcesStats();

  const maxLeads = Math.max(...leadsData.map((d) => d[1]), 1);
  const maxEarnings = Math.max(...earningsData.map((d) => d[1]), 1);

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
            <h1 className="text-4xl font-bold mb-2">📊 Аналитика</h1>
            <p className="text-gray-400">Графики и статистика твоей программы</p>
          </div>
          <Link
            href="/partner/dashboard"
            className="px-6 py-3 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400/10 transition"
          >
            ← Назад
          </Link>
        </div>

        {/* Date Range Filter */}
        <div className="flex gap-3 mb-12">
          {['week', 'month', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                dateRange === range
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'bg-slate-800/50 border border-blue-400/20 hover:border-blue-400/50'
              }`}
            >
              {range === 'week' && '📅 На неделю'}
              {range === 'month' && '📅 На месяц'}
              {range === 'all' && '📅 За всё время'}
            </button>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Leads Chart */}
          <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-bold mb-6">👥 Рост лидов</h2>
            <div className="space-y-4">
              {leadsData.map(([date, count]) => (
                <div key={date}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">{date}</span>
                    <span className="font-bold text-blue-400">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                      style={{ width: `${(count / maxLeads) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Chart */}
          <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-bold mb-6">💰 Доход по дням</h2>
            <div className="space-y-4">
              {earningsData.map(([date, amount]) => (
                <div key={date}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">{date}</span>
                    <span className="font-bold text-emerald-400">{amount.toLocaleString()}₽</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400"
                      style={{ width: `${(amount / maxEarnings) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sources */}
        <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8">
          <h2 className="text-2xl font-bold mb-6">🔍 Источники трафика</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(sourcesData).map(([source, stats]: [string, any]) => {
              const conversionRate = stats.leads > 0 ? ((stats.paid / stats.leads) * 100).toFixed(1) : 0;
              return (
                <div key={source} className="p-6 rounded-xl bg-slate-700/50 border border-blue-400/20">
                  <h3 className="font-bold mb-4 text-lg capitalize">
                    {source === 'telegram' && '📱 Telegram'}
                    {source === 'vk' && '🔘 VK'}
                    {source === 'instagram' && '📷 Instagram'}
                    {source === 'youtube' && '▶️ YouTube'}
                    {source === 'other' && '🌐 Другое'}
                    {!['telegram', 'vk', 'instagram', 'youtube', 'other'].includes(source) && `🔗 ${source}`}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Лидов</p>
                      <p className="text-2xl font-bold text-blue-400">{stats.leads}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Оплачено</p>
                      <p className="text-2xl font-bold text-green-400">{stats.paid}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Конверсия</p>
                      <p className="text-2xl font-bold text-purple-400">{conversionRate}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <SummaryCard
            icon="👥"
            label="Всего лидов"
            value={referrals.length}
            color="text-blue-400"
          />
          <SummaryCard
            icon="📊"
            label="Средняя конверсия"
            value={`${(
              (referrals.filter((r) => r.status === 'paid').length / referrals.length) *
              100
            ).toFixed(1)}%`}
            color="text-purple-400"
          />
          <SummaryCard
            icon="💰"
            label="Средний чек"
            value={`${(
              earnings.reduce((sum, e) => sum + (e.commission || 0), 0) /
              referrals.filter((r) => r.status === 'paid').length
            ).toFixed(0)}₽`}
            color="text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
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
