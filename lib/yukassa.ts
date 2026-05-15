// lib/yukassa.ts

export type PlanId = "basic" | "pro";

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // в рублях
  durationDays: number;
}

export const PLANS: Record<PlanId, Plan> = {
  basic: { id: "basic", name: "Basic",  price: 299,  durationDays: 30 },
  pro:   { id: "pro",   name: "PRO",    price: 499,  durationDays: 30 },
};

export interface YookassaPayment {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  amount: { value: string; currency: string };
  metadata: { userId: string; planId: PlanId; refCode?: string };
  confirmation: { confirmation_url: string };
}

/** Создаёт платёж через ЮKassa API */
export async function createPayment(
  userId: string,
  planId: PlanId,
  returnUrl: string,
  refCode?: string
): Promise<YookassaPayment> {
  const plan = PLANS[planId];
  const idempotenceKey = `${userId}-${planId}-${Date.now()}`;

  const res = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        btoa(
          `${process.env.YUKASSA_SHOP_ID}:${process.env.YUKASSA_SECRET_KEY}`
        ),
      "Idempotence-Key": idempotenceKey,
    },
    body: JSON.stringify({
      amount: { value: plan.price.toFixed(2), currency: "RUB" },
      confirmation: { type: "redirect", return_url: returnUrl },
      capture: true,
      description: `AI Tools — тариф ${plan.name}`,
      metadata: { userId, planId, refCode: refCode ?? "" },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.description ?? "ЮKassa: ошибка создания платежа");
  }

  return res.json();
}

/** Проверяет IP-адрес вебхука ЮKassa */
export function isYookassaIp(ip: string): boolean {
  const allowed = [
    "185.71.76.0/27",
    "185.71.77.0/27",
    "77.75.153.0/25",
    "77.75.156.11",
    "77.75.156.35",
    "77.75.154.128/25",
    "2a02:5180::/32",
  ];
  // Упрощённая проверка для IPv4 без CIDR (для production используйте пакет 'ip-range-check')
  return allowed.some((a) => ip.startsWith(a.split("/")[0].slice(0, -1)));
}
