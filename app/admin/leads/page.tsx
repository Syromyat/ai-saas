'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Lead {
  id: string;
  email: string;
  plan: string;
  referred_by: string | null;
  created_at: string;
  subscription_end: string | null;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const getLeads = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      setLeads(data || []);
      setLoading(false);
    };

    getLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    if (filter === 'paid') return lead.plan !== 'free';
    if (filter === 'free') return lead.plan === 'free';
    if (filter === 'referral') return lead.referred_by !== null;
    return true;
  });

  const stats = {
    all: leads.length,
    paid: leads.filter((l) => l.plan !== 'free').length,
    free: leads.filter((l) => l.plan === 'free').length,
    referral: leads.filter((l) => l.referred_by !== null).length,
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p>Загрузка лидов...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">👥 Все лиды</h1>
        <p className="text-gray-400">Полный список пользователей и их источники</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <FilterButton
          label={`Все (${stats.all})`}
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        <FilterButton
          label={`Оплативших (${stats.paid})`}
          active={filter === 'paid'}
          onClick={() => setFilter('paid')}
        />
        <FilterButton
          label={`Бесплатных (${stats.free})`}
          active={filter === 'free'}
          onClick={() => setFilter('free')}
        />
        <FilterButton
          label={`По реферраллам (${stats.referral})`}
          active={filter === 'referral'}
          onClick={() => setFilter('referral')}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-blue-400/20 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50 border-b border-blue-400/10">
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Email</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Тариф</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Источник</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Дата регистрации</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-blue-400/10 hover:bg-slate-800/30 transition"
              >
                <td className="px-6 py-4 text-sm">{lead.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    lead.plan === 'free'
                      ? 'bg-gray-500/20 text-gray-300'
                      : lead.plan === 'basic'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {lead.plan.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {lead.referred_by ? (
                    <span className="text-blue-400">🔗 {lead.referred_by}</span>
                  ) : (
                    <span className="text-gray-500">🌐 Прямой</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-6 py-4 text-sm">
                  {lead.subscription_end ? (
                    <span className="text-green-400">✓ Активна</span>
                  ) : (
                    <span className="text-yellow-400">⏳ Истекла</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-xl">Лидов не найдено</p>
        </div>
      )}
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
