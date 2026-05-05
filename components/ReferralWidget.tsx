"use client";

import { useState } from "react";

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

// Моковые данные для демо — заменить на fetch("/api/referral?userId=...")
const MOCK: ReferralData = {
  code: "IVAN-XK7F",
  link: "https://yourapp.ru/register?ref=IVAN-XK7F",
  invitedUsers: [
    { email: "anna@example.com",  subscribedAt: "2025-04-12", rewardGranted: true  },
    { email: "dmitr@example.com", subscribedAt: null,         rewardGranted: false },
    { email: "kate@example.com",  subscribedAt: "2025-05-01", rewardGranted: true  },
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

  const pending   = data.invitedUsers.filter(u => !u.subscribedAt);
  const rewarded  = data.invitedUsers.filter(u => u.rewardGranted);
  const waiting   = data.invitedUsers.filter(u => u.subscribedAt && !u.rewardGranted);

  return (
    <div className="space-y-6">

      {/* Hero-баннер */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-600/20 to-violet-900/10 border border-violet-500/30 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Приведи друга — получи месяц бесплатно</h2>
            <p className="text-sm text-zinc-400 max-w-md">
              Поделитесь своей ссылкой. Когда друг оформит любую подписку, вы получите&nbsp;
              <span className="text-violet-400 font-semibold">+1 месяц</span> на свой аккаунт автоматически.
            </p>
          </div>
          <div className="text-center shrink-0">
            <div className="text-3xl font-bold text-violet-400">{data.totalRewards}</div>
            <div className="text-xs text-zinc-500 mt-0.5">месяцев получено</div>
          </div>
        </div>
      </div>

      {/* Реферальная ссылка */}
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-2">
          Ваша реферальная ссылка
        </p>
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 font-mono overflow-x-auto whitespace-nowrap">
            {data.link}
          </div>
          <button
            onClick={copyLink}
            className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              copied
                ? "bg-green-600 text-white"
                : "bg-violet-600 hover:bg-violet-500 text-white"
            }`}
          >
            {copied ? "✓ Скопировано" : "Копировать"}
          </button>
        </div>
        <p className="text-xs text-zinc-600 mt-2">Ваш код: <span className="text-zinc-400 font-mono">{data.code}</span></p>
      </div>

      {/* Как работает */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { step: "1", title: "Копируйте ссылку", desc: "Поделитесь с другом любым удобным способом" },
          { step: "2", title: "Друг регистрируется", desc: "Он переходит по ссылке и создаёт аккаунт" },
          { step: "3", title: "Друг оплачивает", desc: "После оплаты вы автоматически получаете +1 месяц" },
        ].map((s) => (
          <div key={s.step} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-sm font-bold text-violet-400 mx-auto mb-3">
              {s.step}
            </div>
            <p className="text-sm font-semibold text-white mb-1">{s.title}</p>
            <p className="text-xs text-zinc-500">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Список друзей */}
      {data.invitedUsers.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-3">
            Приглашённые друзья
          </p>
          <div className="rounded-2xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800">
            {data.invitedUsers.map((u) => (
              <div key={u.email} className="flex items-center justify-between px-5 py-4 bg-zinc-900 gap-4">
                <div>
                  <p className="text-sm text-white">{u.email}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {u.subscribedAt
                      ? `Подписался ${new Date(u.subscribedAt).toLocaleDateString("ru-RU")}`
                      : "Ещё не оформил подписку"}
                  </p>
                </div>
                <StatusBadge user={u} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Итог */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <Stat label="Ожидают" value={pending.length}  color="text-zinc-400" />
        <Stat label="Подписались" value={waiting.length + rewarded.length} color="text-violet-400" />
        <Stat label="Месяцев получено" value={data.totalRewards} color="text-green-400" />
      </div>

    </div>
  );
}

function StatusBadge({ user }: { user: InvitedUser }) {
  if (user.rewardGranted) {
    return (
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-600/15 text-green-400 border border-green-600/30 whitespace-nowrap">
        ✓ Награда выдана
      </span>
    );
  }
  if (user.subscribedAt) {
    return (
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-600/15 text-yellow-400 border border-yellow-600/30 whitespace-nowrap">
        ⏳ Начисляется
      </span>
    );
  }
  return (
    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700 whitespace-nowrap">
      Не подписан
    </span>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-3">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
    </div>
  );
}
