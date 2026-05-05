// lib/referral.ts

export interface ReferralRecord {
  code: string;          // уникальный реферальный код владельца
  ownerId: string;       // userId владельца кода
  invitedUsers: {
    userId: string;
    email: string;
    subscribedAt: string | null;  // дата оформления подписки
    rewardGranted: boolean;       // награда уже выдана
  }[];
  totalRewards: number;  // кол-во выданных месяцев
}

/** Генерирует уникальный реферальный код из userId */
export function generateReferralCode(userId: string): string {
  const base = userId.replace(/[^a-z0-9]/gi, "").slice(0, 5).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${rand}`;
}

/** Строит реферальную ссылку */
export function buildReferralLink(code: string, baseUrl: string): string {
  return `${baseUrl}/register?ref=${code}`;
}
