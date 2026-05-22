export type PlanId = 'basic' | 'pro';

export const PLANS: Record<string, any> = {
  basic: {
    planId: 'basic',
    name: 'БАЗОВЫЙ',
    price: 299,
    requests: 100,
    duration: '1 месяц',
  },
  pro: {
    planId: 'pro',
    name: 'PRO',
    price: 499,
    requests: -1, // unlimited
    duration: '1 месяц',
  },
};

export const YUKASSA_CONFIG = {
  shopId: process.env.YUKASSA_SHOP_ID || '1362854', // ← НОВЫЙ ID
  secretKey: process.env.YUKASSA_SECRET_KEY,
  apiUrl: 'https://api.yookassa.ru/v3/payments',
};

export function getPaymentData(
  planId: PlanId,
  userId: string,
  email: string,
  referralCode?: string
) {
  const plan = PLANS[planId];
  if (!plan) throw new Error('Invalid plan');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ai-saas-blue-zeta.vercel.app';

  return {
    amount: {
      value: plan.price.toFixed(2),
      currency: 'RUB',
    },
    confirmation: {
      type: 'redirect',
      return_url: `${baseUrl}/dashboard?payment=success`,
    },
    capture: true,
    description: `Подписка AI Tools - ${plan.name}`,
    metadata: {
      userId,
      planId,
      refCode: referralCode || '',
    },
    receipt: {
      customer: {
        email,
      },
      items: [
        {
          description: `Подписка AI Tools - ${plan.name}`,
          quantity: '1',
          amount: {
            value: plan.price.toFixed(2),
            currency: 'RUB',
          },
          vat_code: 6,
          payment_mode: 'full_payment',
          payment_subject: 'service',
        },
      ],
      internet: 'true',
    },
  };
}
