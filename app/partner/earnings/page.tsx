'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PartnerEarningsPage() {
  const [partner, setPartner] = useState<any>(null);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('card');
  const router = useRouter();

  useEffect(() => {
    const getFinanceData = async () => {
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

      // Получаем заработки
      const { data: earningsData } = await supabase
        .from('partner_earnings')
        .select('*')
        .eq('partner_id', partnerData.id)
        .order('created_at', { ascending: false });

      setEarnings(earningsData || []);

      // Получаем выплаты
      const { data: payoutsData } = await supabase
        .from('partner_payouts')
        .select('*')
        .eq('partner_id', partnerData.id)
        .order('created_at', { ascending: false });

      setPayouts(payoutsData || []);
      setLoading(false);
    };

    getFinanceData();
  }, [router]);

  const filteredEarnings = earnings.filter((earning) => {
    if (filter === 'pending') return earning.status === 'pending';
    if (filter === 'completed') return earning.status === 'completed';
    if (filter === 'paid') return earning.status === 'paid';
    return true;
  });

  const totalEarnings = earnings.reduce((sum, e) => sum + (e.commission || 0), 0);
  const pendingEarnings = earnings
    .filter((e) => e.status === 'pending')
    .reduce((sum, e) => sum + (e.commission || 0), 0);
  const paidEarnings = earnings
    .filter((e) => e.status === 'paid')
    .reduce((sum, e) => sum + (e.commission || 0), 0);
  const totalPayouts = payouts
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  async function handleRequestPayout() {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      alert('Введи корректную сумму');
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.from('partner_payouts').insert({
      partner_id: partner.id,
      amount: parseFloat(payoutAmount),
      payment_method: payoutMethod,
      status: 'pending',
    });

    if (error) {
      alert('Ошибка: ' + error.message);
      return;
    }

    alert('✓ Заявка на выплату создана!');
    setShowPayoutModal(false);
    setPayoutAmount('');
    
    // Перезагружаем данные
    window.location.reload();
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
            <h1 className="text-4xl font-bold mb-2">💰 Финансы</h1>
            <p className="text-gray-400">Твои заработки и выплаты</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowPayoutModal(true)}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/50 transition font-bold"
            >
              💸 Запросить выплату
            </button>
            <Link
              href="/partner/dashboard"
              className="px-6 py-3 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400/10 transition"
            >
              ← Назад
            </Link>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon="💰"
            label="Всего заработано"
            value={`${totalEarnings.toLocaleString()}₽`}
            color="text-emerald-400"
          />
          <StatCard
            icon="⏳"
            label="В ожидании"
            value={`${pendingEarnings.toLocaleString()}₽`}
            color="text-yellow-400"
          />
          <StatCard
            icon="✓"
            label="Начислено"
            value={`${paidEarnings.toLocaleString()}₽`}
            color="text-green-400"
          />
          <StatCard
            icon="🏦"
            label="Выплачено"
            value={`${totalPayouts.toLocaleString()}₽`}
            color="text-blue-400"
          />
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Earnings Table */}
          <div className="lg:col-span-2 rounded-3xl border border-blue-400/20 overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
            <div className="px-8 py-6 border-b border-blue-400/20">
              <h2 className="text-2xl font-bold mb-4">📊 Начисления</h2>
              <div className="flex flex-wrap gap-3">
                <FilterButton
                  label={`Все (${earnings.length})`}
                  active={filter === 'all'}
                  onClick={() => setFilter('all')}
                />
                <FilterButton
                  label={`В ожидании (${earnings.filter((e) => e.status === 'pending').length})`}
                  active={filter === 'pending'}
                  onClick={() => setFilter('pending')}
                />
                <FilterButton
                  label={`Начислено (${earnings.filter((e) => e.status === 'completed').length})`}
                  active={filter === 'completed'}
                  onClick={() => setFilter('completed')}
                />
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50 border-b border-blue-400/10">
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Дата</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Тариф</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Сумма</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Комиссия</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-400">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filteredEarnings.map((earning) => (
                  <tr
                    key={earning.id}
                    className="border-b border-blue-400/10 hover:bg-slate-700/30 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(earning.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-semibold">
                        {earning.plan_type?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">{earning.amount}₽</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-400">+{earning.commission}₽</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          earning.status === 'completed'
                            ? 'bg-green-500/20 text-green-300'
                            : earning.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {earning.status === 'completed' && '✓ Начислено'}
                        {earning.status === 'pending' && '⏳ В ожидании'}
                        {earning.status === 'paid' && '🏦 Выплачено'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEarnings.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p>Начисления отсутствуют</p>
              </div>
            )}
          </div>

          {/* Payouts Sidebar */}
          <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-bold mb-6">🏦 Выплаты</h2>

            <div className="space-y-4">
              {payouts.length > 0 ? (
                payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="p-4 rounded-lg bg-slate-700/50 border border-blue-400/20"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">{payout.amount.toLocaleString()}₽</span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          payout.status === 'completed'
                            ? 'bg-green-500/20 text-green-300'
                            : payout.status === 'processing'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {payout.status === 'completed' && '✓ Выплачено'}
                        {payout.status === 'processing' && '⏳ Обработка'}
                        {payout.status === 'pending' && '⏸ Ожидание'}
                        {payout.status === 'failed' && '✗ Ошибка'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      {payout.payment_method === 'card' && '💳 На карту'}
                      {payout.payment_method === 'crypto' && '₿ Крипто'}
                      {payout.payment_method === 'bank' && '🏦 На счёт'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(payout.requested_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-400 text-sm">
                  Выплат ещё нет
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-400/30 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">💸 Запросить выплату</h3>
            <p className="text-gray-400 mb-6">Доступно к выплате: <span className="text-emerald-400 font-bold">{pendingEarnings.toLocaleString()}₽</span></p>

            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold mb-2">Сумма (₽)</label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-blue-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              {/* Method */}
              <div>
                <label className="block text-sm font-semibold mb-2">Способ выплаты</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-blue-400/20 text-white focus:outline-none focus:border-blue-400 transition"
                >
                  <option value="card">💳 На карту</option>
                  <option value="crypto">₿ Крипто</option>
                  <option value="bank">🏦 На счёт</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPayoutModal(false)}
                  className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800/50 transition font-semibold"
                >
                  Отменить
                </button>
                <button
                  onClick={handleRequestPayout}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:shadow-lg hover:shadow-green-500/50 transition"
                >
                  ✓ Запросить
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
      className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
        active
          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
          : 'bg-slate-700/50 border border-blue-400/20 hover:border-blue-400/50'
      }`}
    >
      {label}
    </button>
  );
}
