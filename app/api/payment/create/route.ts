import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPayment, PLANS } from "@/lib/yukassa";
import type { PlanId } from "@/lib/yukassa";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { planId }: { planId: PlanId } = await req.json();

    if (!PLANS[planId]) {
      return NextResponse.json({ error: "Неверный тариф" }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("referred_by, email")
      .eq("id", user.id)
      .single();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const returnUrl = `${baseUrl}/dashboard?payment=success`;
    const plan = PLANS[planId];
    const userEmail = profile?.email ?? user.email ?? "user@example.com";

    const idempotenceKey = `${user.id}-${planId}-${Date.now()}`;

    const paymentData = {
      amount: { value: plan.price.toFixed(2), currency: "RUB" },
      confirmation: { type: "redirect", return_url: returnUrl },
      capture: true,
      description: `Подписка AI Tools - ${plan.name}`,
      metadata: {
        userId: user.id,
        planId,
        refCode: profile?.referred_by ?? "",
      },
      receipt: {
        customer: {
          email: userEmail,
        },
        items: [
          {
            description: `Подписка AI Tools - ${plan.name}`,
            quantity: "1",
            amount: {
              value: plan.price.toFixed(2),
              currency: "RUB",
            },
            payment_mode: "full_payment",
            payment_subject: "service",
          },
        ],
        internet: "true",
      },
    };

    console.log("Sending to YooKassa:", JSON.stringify(paymentData, null, 2));

    const res = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          btoa(`${process.env.YUKASSA_SHOP_ID}:${process.env.YUKASSA_SECRET_KEY}`),
        "Idempotence-Key": idempotenceKey,
      },
      body: JSON.stringify(paymentData),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("ЮKassa error:", err);
      throw new Error(err.description ?? "Ошибка создания платежа");
    }

    const payment = await res.json();

    return NextResponse.json({ url: payment.confirmation.confirmation_url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Ошибка создания платежа";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
