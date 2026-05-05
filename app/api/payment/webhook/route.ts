import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/yukassa";
import type { YookassaPayment } from "@/lib/yukassa";

export async function POST(req: Request) {
  try {
    // ЮKassa шлёт JSON с событием
    const event: { type: string; object: YookassaPayment } = await req.json();

    // Нас интересует только успешная оплата
    if (event.type !== "payment.succeeded") {
      return NextResponse.json({ ok: true });
    }

    const payment = event.object;
    if (payment.status !== "succeeded") {
      return NextResponse.json({ ok: true });
    }

    const { userId, planId, refCode } = payment.metadata;
    const plan = PLANS[planId];

    if (!userId || !plan) {
      console.error("Webhook: неверные метаданные", payment.metadata);
      return NextResponse.json({ error: "bad metadata" }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Обновляем тариф пользователя
    const now = new Date();
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_end")
      .eq("id", userId)
      .single();

    // Если подписка ещё активна — продлеваем от текущего конца
    const base =
      profile?.subscription_end && new Date(profile.subscription_end) > now
        ? new Date(profile.subscription_end)
        : now;

    const subscriptionEnd = new Date(base);
    subscriptionEnd.setDate(subscriptionEnd.getDate() + plan.durationDays);

    await supabase
      .from("profiles")
      .update({ plan: planId, subscription_end: subscriptionEnd.toISOString() })
      .eq("id", userId);

    // 2. Реферальная награда — если пришёл по реф-ссылке
    if (refCode) {
      // Найти владельца кода
      const { data: owner } = await supabase
        .from("profiles")
        .select("id, subscription_end, plan")
        .eq("referral_code", refCode)
        .single();

      if (owner) {
        // Проверяем, что награда ещё не выдавалась за этого пользователя
        const { data: referral } = await supabase
          .from("referrals")
          .select("id, reward_granted")
          .eq("ref_code", refCode)
          .eq("invited_user_id", userId)
          .single();

        if (referral && !referral.reward_granted) {
          // +30 дней владельцу
          const ownerBase =
            owner.subscription_end && new Date(owner.subscription_end) > now
              ? new Date(owner.subscription_end)
              : now;

          const ownerNewEnd = new Date(ownerBase);
          ownerNewEnd.setDate(ownerNewEnd.getDate() + 30);

          await supabase
            .from("profiles")
            .update({
              subscription_end: ownerNewEnd.toISOString(),
              // Если владелец был на free — поднимаем до basic
              plan: owner.plan === "free" ? "basic" : owner.plan,
            })
            .eq("id", owner.id);

          // Помечаем реферал как выполненный
          await supabase
            .from("referrals")
            .update({
              reward_granted: true,
              subscribed_at: now.toISOString(),
            })
            .eq("id", referral.id);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
