'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [editCommission, setEditCommission] = useState('');

  useEffect(() => {
    const getPartners = async () => {
      const supabase = createClient();

      const { data: partnersData } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      // Получаем статистику для каждого партнёра
      const partnersWithStats = await Promise.all(
        (partnersData || []).map(async (partner) => {
          const { data: referrals } = await supabase
            .from('partner_referrals')
            .select('*')
            .eq('partner_id', partner.id);

          const { data: earnings } = await supabase
            .from('partner_earnings')
            .select('*')
            .eq('partner_id', partner.id);

          const totalLeads = referrals?.length || 0;
          const totalPaid = referrals?.filter((r) => r.status === 'paid').length || 0;
          const totalEarnings = earnings?.reduce((sum, e) => sum + (e.commission || 0), 0) || 0;

          return {
            ...partner,
            totalLeads,
            totalPaid,
            totalEarnings,
            conversionRate: totalLeads > 0 ? ((totalPaid / totalLeads) * 100).toFixed(1) : 0,
          };
        })
      );

      setPartners(partnersWithStats);
      setLoading(false);
    };

    getPartners();
  }, []);

  const filteredPartners = partners.filter((partner) => {
    if (filter === 'active') return partner.status === 'active';
    if (filter === 'blocked') return partner.status === 'blocked';
    return true;
  });

  const stats = {
    all: partners.length,
    active: partners.filter((p) => p.status === 'active').length,
    blocked: partners.filter((p) => p.status === 'blocked').length,
    totalEarnings: partners.reduce((sum, p) => sum + p.totalEarnings, 0),
  };

  async function updateCommission() {
    const supabase = createClient();

    const { error } = await supabase
      .from('partners')
      .update({ commission_percent: parseFloat(editCommission) })
      .eq('id', selectedPartner.id);

    if (error) {
      alert('Ошибка: ' + error.message);
      return;
    }

    alert('✓ Комиссия обновлена!');
    setSelectedPartner(null);
    window.location.reload();
  }

  async function togglePartnerStatus(partnerId: string, currentStatus: string) {
    const supabase = createClient();

    const { error } = await supabase
      .from('partners')
      .update({ status: currentStatus === 'active' ? 'blocked' : 'active' })
      .eq('id', partnerId);

    if (error) {
      alert('Ошибка: ' + error.message);
      return;
    }

    window.location.reload();
  }

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
        <h1 className="text-4xl font-bold mb-2">🤝 Партнёры</h1>
        <p className="text-gray-400">Управление партнёрской программой</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="👥" label="Всего партнёров" value={stats.all} color="text-blue-400" />
        <StatCard icon="✓" label="Активных" value={stats.active} color="text-green-400" />
        <StatCard icon="🚫" label="Заблокировано" value={stats.blocked} color="text-red-400" />
        <StatCard icon="💰" label="Всего выплачено" value={`${stats.totalEarnings.toLocaleString()}₽`} color="text-emerald-400" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <FilterButton
          label={`Все (${stats.all})`}
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        <FilterButton
          label={`Активные (${stats.active})`}
          active={filter === 'active'}
          onClick={() => setFilter('active')}
        />
        <FilterButton
          label={`Заблокированные (${stats.blocked})`}
          active={filter === 'blocked'}
          onClick={() => setFilter('blocked')}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-blue-400/20 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50 border-b border-blue-400/10">
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Имя</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Email</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Лиды</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Оплачено</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Конверсия</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Комиссия</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Заработок</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Статус</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Действие</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map((partner) => (
              <tr key={partner.id} className="border-b border-blue-400/10 hover:bg-slate-800/30 transition">
                <td className="px-6 py-4 text-sm font-semibold">{partner.name || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{partner.email}</td>
                <td className="px-6 py-4 text-sm font-bold">{partner.totalLeads}</td>
                <td className="px-6 py-4 text-sm font-bold text-green-400">{partner.totalPaid}</td>
                <td className="px-6 py-4 text-sm font-bold text-purple-400">{partner.conversionRate}%</td>
                <td className="px-6 py-4 text-sm font-bold text-blue-400">{partner.commission_percent}%</td>
                <td className="px-6 py-4 text-sm font-bold text-emerald-400">
                  {partner.totalEarnings.toLocaleString()}₽
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      partner.status === 'active'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {partner.status === 'active' ? '✓ Активен' : '🚫 Заблокирован'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-y-2">
                  <button
                    onClick={() => {
                      setSelectedPartner(partner);
                      setEditCommission(partner.commission_percent.toString());
                    }}
                    className="block text-blue-400 hover:text-blue-300 transition text-xs"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => togglePartnerStatus(partner.id, partner.status)}
                    className={`block text-xs transition ${
                      partner.status === 'active'
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-green-400 hover:text-green-300'
                    }`}
                  >
                    {partner.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-400/30 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              Редактировать {selectedPartner.name || 'партнёра'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={selectedPartner.email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-blue-400/20 text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Комиссия (%)</label>
                <input
                  type="number"
                  value={editCommission}
                  onChange={(e) => setEditCommission(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-blue-400/20 text-white focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800/50 transition font-semibold"
                >
                  Отменить
                </button>
                <button
                  onClick={updateCommission}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 transition"
                >
                  ✓ Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
