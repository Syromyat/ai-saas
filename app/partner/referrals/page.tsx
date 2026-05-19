'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PartnerReferralsPage() {
  const [partner, setPartner] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const getReferrals = async () => {
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
      setLoading(false);
    };

    getReferrals();
  }, [router]);

  const filteredReferrals = referrals.filter((ref) => {
    if (filter === 'lead') return ref.status === 'lead';
    if (filter === 'registered') return ref.status === 'registered';
    if (filter === 'paid') return ref.status === 'paid';
    return true;
  });

  const stats = {
    all: referrals.length,
    leads: referrals.filter((r) => r.status === 'lead').length,
    registered: referrals.filter((r) => r.status === 'registered').length,
    paid: referrals.filter((r) => r.status === 'paid').length,
  };

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
            <h1 className="text-4xl font-bold mb-2">👥 Мои лиды</h1>
            <p className="text-gray-400">Все привлечённые пользователи</p>
          </div>
          <Link
            href="/partner/dashboard"
            className="px-6 py-3 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400/10 transition"
          >
            ← Назад
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <FilterButton
            label={`Все (${stats.all})`}
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          />
          <FilterButton
            label={`Новые лиды (${stats.leads})`}
            active={filter === 'lead'}
            onClick={() => setFilter('lead')}
          />
          <FilterButton
            label={`Зарегистрировано (${stats.registered})`}
            active={filter === 'registered'}
            onClick={() => setFilter('registered')}
          />
          <FilterButton
            label={`Оплачено (${stats.paid})`}
            active={filter === 'paid'}
            onClick={() => setFilter('paid')}
          />
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-blue-400/20 overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 border-b border-blue-400/10">
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Дата</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Источник</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">UTM Источник</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Статус</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Действие</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferrals.map((referral) => (
                <tr
                  key={referral.id}
                  className="border-b border-blue-400/10 hover:bg-slate-700/30 transition"
                >
                  <td className="px-6 py-4 text-sm font-mono text-gray-300">
                    {referral.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(referral.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {referral.source ? (
                      <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-semibold">
                        {referral.source.toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {referral.utm_source || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={referral.status} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-400 hover:text-blue-300 transition">
                      Детали →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredReferrals.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Лидов не найдено</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <StatsCard
            icon="📊"
            label="Конверсия лидов"
            value={`${((stats.registered / stats.all) * 100).toFixed(1)}%`}
            color="text-blue-400"
          />
          <StatsCard
            icon="💰"
            label="Конверсия продаж"
            value={`${((stats.paid / stats.all) * 100).toFixed(1)}%`}
            color="text-green-400"
          />
          <StatsCard
            icon="⏳"
            label="В ожидании"
            value={stats.leads}
            color="text-yellow-400"
          />
          <StatsCard
            icon="✓"
            label="Завершено"
            value={stats.paid}
            color="text-purple-400"
          />
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
        active
          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
          : 'bg-slate-800/50 border border-blue-400/20 hover:border-blue-400/50'
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    lead: { bg: 'bg-gray-500/20', text: 'text-gray-300', label: '🌐 Новый лид' },
    registered: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: '✍️ Зарегистрирован' },
    paid: { bg: 'bg-green-500/20', text: 'text-green-300', label: '✓ Оплачено' },
  };

  const badge = badges[status] || badges.lead;

  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${badge.bg} ${badge.text}`}>
      {badge.label}
    </span>
  );
}

function StatsCard({
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
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
