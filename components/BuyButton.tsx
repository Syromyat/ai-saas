"use client";

import { useState } from "react";
import type { PlanId } from "@/lib/yukassa";

interface Props {
  planId: PlanId | null; // null = бесплатный план
  currentPlan?: string;
}

export default function BuyButton({ planId, currentPlan }: Props) {
  const [loading, setLoading] = useState(false);

  if (!planId) {
    return (
      <button
        disabled
        className="w-full py-2.5 rounded-full text-sm font-semibold border border-zinc-700 text-zinc-500 cursor-default"
      >
        {currentPlan === "free" ? "Текущий тариф" : "Бесплатно"}
      </button>
    );
  }

  const isCurrent = currentPlan === planId;

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Ошибка оплаты");
        setLoading(false);
      }
    } catch {
      alert("Ошибка сети");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading || isCurrent}
      className={`w-full py-2.5 rounded-full text-sm font-semibold transition-colors border ${
        isCurrent
          ? "border-zinc-700 text-zinc-500 cursor-default"
          : "border-violet-500 bg-violet-600 hover:bg-violet-500 text-white"
      } disabled:opacity-50`}
    >
      {loading ? "Переход к оплате..." : isCurrent ? "Текущий тариф" : "Оплатить"}
    </button>
  );
}
