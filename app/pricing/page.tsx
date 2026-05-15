import { createClient } from "@/lib/supabase/server";
import PricingCard from "@/components/PricingCard";
import BuyButton from "@/components/BuyButton";

export const metadata = { title: "Тарифы — AI Tools" };

const plans = [
  {
    planId: null as null,
    title: "Бесплатно",
    price: "0 ₽",
    period: "/ навсегда",
    features: [
      { label: "5 запросов в день", included: true },
      { label: "3 инструмента", included: true },
      { label: "История запросов", included: false },
      { label: "Приоритетная очередь", included: false },
    ],
  },
  {
    planId: "basic" as const,
    title: "Basic",
    price: "299 ₽",
    period: "/ мес",
    featured: true,
    badge: "Популярный",
    features: [
      { label: "100 запросов в день", included: true },
      { label: "Все инструменты", included: true },
      { label: "История запросов", included: true },
      { label: "Приоритетная очередь", included: false },
    ],
  },
  {
    planId: "pro" as const,
    title: "PRO",
    price: "499 ₽",
    period: "/ мес",
    features: [
      { label: "Безлимитные запросы", included: true },
      { label: "Все инструменты", included: true },
      { label: "История запросов", included: true },
      { label: "Приоритетная очередь", included: true },
    ],
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let currentPlan = "free";
  let subscriptionEnd: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, subscription_end")
      .eq("id", user.id)
      .single();

    if (profile) {
      currentPlan = profile.plan;
      subscriptionEnd = profile.subscription_end;
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Тарифы</h1>
        <p className="text-zinc-400 text-center mb-2">Начните бесплатно, улучшите когда нужно</p>
        {subscriptionEnd && (
          <p className="text-center text-sm text-violet-400 mb-10">
            Ваша подписка активна до{" "}
            {new Date(subscriptionEnd).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        {!subscriptionEnd && <div className="mb-10" />}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              {...plan}
              customButton={
                <BuyButton planId={plan.planId} currentPlan={currentPlan} />
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
}
