'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      const supabase = createClient();

      const { data: users } = await supabase.from('profiles').select('*');
      const { data: payments } = await supabase.from('payments').select('*');

      const totalUsers = users?.length || 0;
      const paidUsers = users?.filter((u: any) => u.plan !== 'free').length || 0;
      const freeUsers = totalUsers - paidUsers;
      const totalRevenue = payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;
      const withReferrer = users?.filter((u: any) => u.referred_by).length || 0;

      const sources: Record<string, number> = {};
      users?.forEach((u: any) => {
        const source = u.referred_by || 'Прямой трафик';
        sources[source] = (sources[source] || 0) + 1;
      });

      setStats({
        totalUsers,
        paidUsers,
        freeUsers,
        totalRevenue,
        withReferrer,
        sources,
        conversionRate: totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : 0,
      });
      setLoading(false);
    };

    getStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">📊 Админ-панель</h1>
        <p className="text-gray-400">Аналитика лидов и продаж</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="👥" label="Всего пользователей" value={stats.totalUsers} color="text-blue-400" />
        <StatCard icon="💰" label="Оплативших" value={stats.paidUsers} color="text-green-400" />
        <StatCard icon="📈" label="Конверсия" value={`${stats.conversionRate}%`} color="text-purple-400" />
        <StatCard icon="💳" label="Доход" value={`${stats.totalRevenue.toLocaleString()}₽`} color="text-yellow-400" />
      </div>

      {/* Sources */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20">
        <h2 className="text-2xl font-bold mb-6">🔍 Откуда идут лиды</h2>
        
        <div className="space-y-4">
          {Object.entries(stats.sources)
            .sort((a: [string, unknown], b: [string, unknown]) => (b[1] as number) - (a[1] as number))
            .map(([source, count]: [string, unknown]) => {
              const countNum = count as number;
              const percentage = ((countNum / stats.totalUsers) * 100).toFixed(1);
              return (
                <div key={source}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">
                      {source === 'Прямой трафик' ? '🌐 ' : '🔗 '}
                      {source}
                    </span>
                    <span className="text-sm text-gray-400">
                      {countNum} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-4">
        <Link
          href="/admin/leads"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold hover:shadow-lg hover:shadow-blue-500/50 transition"
        >
          👥 Посмотреть всех лидов
        </Link>
        <Link
          href="/"
          className="px-6 py-3 border border-blue-400 rounded-lg font-bold hover:bg-blue-400/10 transition"
        >
          🏠 На сайт
        </Link>
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
