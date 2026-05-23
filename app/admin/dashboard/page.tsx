'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  Globe,
  Link2,
  BarChart2,
  ArrowRight,
} from 'lucide-react';

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
      const totalRevenue = payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

      const sources: Record<string, number> = {};
      users?.forEach((u: any) => {
        const source = u.referred_by || 'Прямой трафик';
        sources[source] = (sources[source] || 0) + 1;
      });

      setStats({
        totalUsers,
        paidUsers,
        freeUsers: totalUsers - paidUsers,
        totalRevenue,
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
        <h1 className="text-4xl font-bold mb-2">Админ-панель</h1>
        <p className="text-gray-400">Аналитика лидов и продаж</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Всего пользователей"
          value={stats.totalUsers}
          color="text-blue-400"
        />
        <StatCard
          icon={<CreditCard className="w-6 h-6" />}
          label="Оплативших"
          value={stats.paidUsers}
          color="text-green-400"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Конверсия"
          value={`${stats.conversionRate}%`}
          color="text-purple-400"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Доход"
          value={`${stats.totalRevenue.toLocaleString()}₽`}
          color="text-yellow-400"
        />
      </div>

      {/* Sources */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-2xl font-bold">Откуда идут лиды</h2>
        </div>

        <div className="space-y-4">
          {Object.entries(stats.sources)
            .sort((a: [string, unknown], b: [string, unknown]) => (b[1] as number) - (a[1] as number))
            .map(([source, count]: [string, unknown]) => {
              const countNum = count as number;
              const percentage = ((countNum / stats.totalUsers) * 100).toFixed(1);
              return (
                <div key={source}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold flex items-center gap-2">
                      {source === 'Прямой трафик'
                        ? <Globe className="w-4 h-4 text-blue-400" />
                        : <Link2 className="w-4 h-4 text-purple-400" />
                      }
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
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold hover:shadow-lg hover:shadow-blue-500/50 transition"
        >
          <Users className="w-4 h-4" />
          Посмотреть всех лидов
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/admin/partners"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition"
        >
          <Users className="w-4 h-4" />
          Партнёры
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 border border-blue-400 rounded-lg font-bold hover:bg-blue-400/10 transition"
        >
          На сайт
          <ArrowRight className="w-4 h-4" />
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
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 hover:border-blue-400/50 transition group">
      <div className={`mb-3 group-hover:scale-110 transition-transform ${color}`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
