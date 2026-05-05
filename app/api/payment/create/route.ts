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

    // Получаем реферальный код из профиля (если пришёл по реф-ссылке)
    const { data: profile } = await supabase
      .from("profiles")
      .select("referred_by")
      .eq("id", user.id)
      .single();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const returnUrl = `${baseUrl}/dashboard?payment=success`;

    const payment = await createPayment(
      user.id,
      planId,
      returnUrl,
      profile?.referred_by ?? undefined
    );

    return NextResponse.json({ url: payment.confirmation.confirmation_url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Ошибка создания платежа";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
