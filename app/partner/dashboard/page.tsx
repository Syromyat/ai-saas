'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  CreditCard,
  TrendingUp,
  DollarSign,
  Copy,
  CheckCircle,
  LogOut,
  Settings,
  BarChart2,
  Wallet,
  Gift,
  ArrowRight,
} from 'lucide-react';

export default function PartnerDashboard() {
  const [partner, setPartner] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getPartnerData = async () => {
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

  function copyToClipboard(text: string, type: 'link' | 'code') {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
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

  if (!partner) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white py-20 px-6">
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Партнёрский кабинет</h1>
            <p className="text-gray-400">Добро пожаловать, {partner.name || 'Партнёр'}!</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/partner/settings"
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400/10 transition"
            >
              <Settings className="w-4 h-4" />
              Настройки
            </Link>
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                router.push('/');
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              <LogOut className="w-4 h-4" />
              Выход
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard icon={<Users className="w-6 h-6" />} label="Всего лидов" value={stats.totalLeads} color="text-blue-400" />
          <StatCard icon={<UserCheck className="w-6 h-6" />} label="Зарегистрировано" value={stats.totalRegistered} color="text-green-400" />
          <StatCard icon={<CreditCard className="w-6 h-6" />} label="Оплачено" value={stats.totalPaid} color="text-purple-400" />
          <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Конверсия" value={`${stats.conversionRate}%`} color="text-yellow-400" />
          <StatCard icon={<DollarSign className="w-6 h-6" />} label="Заработок" value={`${stats.totalEarnings.toLocaleString()}₽`} color="text-emerald-400" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Реферальная ссылка */}
          <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Copy className="w-5 h-5 text-blue-400" />
              Твоя реферальная ссылка
            </h2>

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
                    onClick={() => copyToClipboard(partner.referral_code, 'code')}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition font-semibold"
                  >
                    {copiedCode ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedCode ? 'Скопировано' : 'Копировать'}
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
                    onClick={() => copyToClipboard(`https://ai-saas-blue-zeta.vercel.app/?ref=${partner.referral_code}`, 'link')}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition font-semibold"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Скопировано' : 'Копировать'}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-400/20">
                <p className="text-sm text-gray-400">
                  Комиссия: <span className="text-blue-400 font-bold">{partner.commission_percent}%</span>
                  <span className="text-gray-500 ml-2">от каждой оплаты твоего пользователя</span>
                </p>
              </div>
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6">Навигация</h2>

            <div className="space-y-3">
              <Link
                href="/partner/referrals"
                className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition border border-blue-400/20 group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-semibold">Мои лиды</p>
                    <p className="text-xs text-gray-400">Список всех лидов</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
              </Link>

              <Link
                href="/partner/earnings"
                className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition border border-blue-400/20 group"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-semibold">Финансы</p>
                    <p className="text-xs text-gray-400">Заработки и выплаты</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
              </Link>

              <Link
                href="/partner/analytics"
                className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition border border-blue-400/20 group"
              >
                <div className="flex items-center gap-3">
                  <BarChart2 className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-semibold">Аналитика</p>
                    <p className="text-xs text-gray-400">Графики и статистика</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
              </Link>

              <Link
                href="/partner/materials"
                className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition border border-blue-400/20 group"
              >
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="font-semibold">Материалы</p>
                    <p className="text-xs text-gray-400">Баннеры и тексты</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Earnings */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Последние начисления
          </h2>

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
                      <td className="py-3 text-sm text-emerald-400 font-semibold">+{earning.commission}₽</td>
                      <td className="py-3 text-sm">
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold w-fit ${
                          earning.status === 'completed'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {earning.status === 'completed'
                            ? <><CheckCircle className="w-3 h-3" /> Начислено</>
                            : <><TrendingUp className="w-3 h-3" /> В ожидании</>
                          }
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Начисления ещё отсутствуют</p>
            </div>
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
