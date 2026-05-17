'use client';

import { useState } from 'react';

interface InvitedUser {
  email: string;
  subscribedAt: string | null;
  rewardGranted: boolean;
}

interface ReferralData {
  code: string;
  link: string;
  invitedUsers: InvitedUser[];
  totalRewards: number;
}

const MOCK: ReferralData = {
  code: 'IVAN-XK7F',
  link: 'https://www.iapro.ru?ref=IVAN-XK7F',
  invitedUsers: [
    { email: 'anna@example.com', subscribedAt: '2025-04-12', rewardGranted: true },
    { email: 'dmitr@example.com', subscribedAt: null, rewardGranted: false },
    { email: 'kate@example.com', subscribedAt: '2025-05-01', rewardGranted: true },
  ],
  totalRewards: 2,
};

export default function ReferralWidget() {
  const data = MOCK;
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(data.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const pending = data.invitedUsers.filter((u) => !u.subscribedAt);
  const rewarded = data.invitedUsers.filter((u) => u.rewardGranted);
  const waiting = data.invitedUsers.filter((u) => u.subscribedAt && !u.rewardGranted);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-400/30 backdrop-blur-xl p-8">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-3">
              🎁 Приведи друга — получи награду
            </h2>
            <p className="text-gray-400 max-w-xl">
              Поделитесь своей реферальной ссылкой с друзьями. Когда они оформят подписку, вы получите{' '}
              <span className="text-blue-400 font-bold">50₽ за каждого</span> на счёт автоматически.
            </p>
          </div>
          <div className="text-center shrink-0 p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {data.totalRewards}
            </div>
            <div className="text-sm text-gray-400 mt-2">друзей награждено</div>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="space-y-4">
        <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">
          📋 Ваша реферальная ссылка
        </label>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            readOnly
            value={data.link}
            className="flex-1 min-w-0 bg-slate-900/50 border border-blue-400/20 rounded-lg px-4 py-3 text-sm text-gray-300 font-mono focus:outline-none"
          />
          <button
            onClick={copyLink}
            className={`px-6 py-3 rounded-lg font-bold text-sm whitespace-nowrap transition-all duration-300 ${
              copied
                ? 'bg-green-500/20 border border-green-400/50 text-green-300'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
            }`}
          >
            {copied ? '✓ Скопирована' : '📋 Копировать'}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Ваш код: <span className="text-gray-400 font-mono font-bold">{data.code}</span>
        </p>
      </div>

      {/* How It Works */}
      <div>
        <h3 className="text-lg font-bold mb-4">Как это работает</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: 1, icon: '📋', title: 'Скопируйте ссылку', desc: 'Поделитесь реф-ссылкой с друзьями' },
            { step: 2, icon: '👤', title: 'Друг регистрируется', desc: 'Он переходит по ссылке и создаёт аккаунт' },
            { step: 3, icon: '💳', title: 'Друг оплачивает', desc: 'После оплаты вы получаете 50₽' },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 hover:border-blue-400/50 transition-all text-center group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white mx-auto mb-4">
                {item.step}
              </div>
              <h4 className="font-bold text-white mb-2">{item.title}</h4>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invited Users */}
      {data.invitedUsers.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4">Приглашённые друзья</h3>
          <div className="rounded-2xl border border-blue-400/20 overflow-hidden divide-y divide-blue-400/10">
            {data.invitedUsers.map((user) => (
              <div
                key={user.email}
                className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 hover:from-slate-800/70 hover:to-slate-900/70 transition-all gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.subscribedAt
                      ? `📅 Подписался ${new Date(user.subscribedAt).toLocaleDateString('ru-RU')}`
                      : '⏳ Ещё не оформил подписку'}
                  </p>
                </div>
                <StatusBadge user={user} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Stat icon="👥" label="Ожидают" value={pending.length} color="text-gray-400" />
        <Stat icon="✓" label="Подписались" value={waiting.length + rewarded.length} color="text-blue-400" />
        <Stat icon="💰" label="Доход" value={`${data.totalRewards * 50}₽`} color="text-green-400" />
      </div>
    </div>
  );
}

function StatusBadge({ user }: { user: InvitedUser }) {
  if (user.rewardGranted) {
    return (
      <span className="text-xs font-bold px-4 py-2 rounded-lg bg-green-500/20 border border-green-400/50 text-green-300 whitespace-nowrap">
        ✓ Награда выдана
      </span>
    );
  }
  if (user.subscribedAt) {
    return (
      <span className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/50 text-blue-300 whitespace-nowrap">
        ⏳ Начисляется
      </span>
    );
  }
  return (
    <span className="text-xs font-bold px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-600/30 text-gray-500 whitespace-nowrap">
      ⏸️ Не подписан
    </span>
  );
}

function Stat({
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
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-2">{label}</div>
    </div>
  );
}
