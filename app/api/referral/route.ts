// app/api/referral/route.ts
// Заглушки — подключите Supabase/DB по аналогии с остальными роутами.
// Структура данных описана в lib/referral.ts

import { NextResponse } from "next/server";

/**
 * GET /api/referral?userId=xxx
 * Возвращает реферальный код пользователя и список приглашённых.
 * В реальном проекте — читать из БД (Supabase / Prisma).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId обязателен" }, { status: 400 });
  }

  // TODO: заменить заглушку на реальный запрос к БД
  const mockData = {
    code: "DEMO-XK7F",
    link: `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/register?ref=DEMO-XK7F`,
    invitedUsers: [
      { email: "user1@example.com", subscribedAt: "2025-04-01", rewardGranted: true },
      { email: "user2@example.com", subscribedAt: null,         rewardGranted: false },
    ],
    totalRewards: 1,
  };

  return NextResponse.json(mockData);
}

/**
 * POST /api/referral/webhook
 * Вызывается после успешной оплаты (из ЮKassa-вебхука или вашей логики).
 * Тело: { newUserId, refCode }
 * — находит владельца кода
 * — помечает друга как подписавшегося
 * — выдаёт +1 месяц владельцу
 */
export async function POST(req: Request) {
  try {
    const { newUserId, refCode } = await req.json();

    if (!newUserId || !refCode) {
      return NextResponse.json({ error: "newUserId и refCode обязательны" }, { status: 400 });
    }

    // TODO:
    // 1. Найти запись referral WHERE code = refCode
    // 2. Найти invited_user WHERE userId = newUserId AND subscribedAt IS NULL
    // 3. Обновить subscribedAt = now(), rewardGranted = false
    // 4. Выдать владельцу +30 дней к подписке (UPDATE users SET subscription_end = subscription_end + interval '30 days')
    // 5. Установить rewardGranted = true

    console.log(`Реферальная награда: владелец кода ${refCode} получает +1 месяц за пользователя ${newUserId}`);

    return NextResponse.json({ success: true, message: "Награда начислена" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка обработки реферала" }, { status: 500 });
  }
}
