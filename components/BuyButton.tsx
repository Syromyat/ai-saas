'use client';

import { useState } from 'react';
import type { PlanId } from '@/lib/yukassa';

interface Props {
  planId: PlanId | null;
  currentPlan?: string;
}

export default function BuyButton({ planId, currentPlan }: Props) {
  const [loading, setLoading] = useState(false);

  if (!planId) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-lg text-sm font-semibold border-2 border-gray-600 text-gray-500 cursor-default bg-gray-900/50 transition-all"
      >
        {currentPlan === 'free' ? '✓ Текущий тариф' : 'Бесплатный'}
      </button>
    );
  }

  const isCurrent = currentPlan === planId;

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? 'Ошибка оплаты');
        setLoading(false);
      }
    } catch {
      alert('Ошибка сети');
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading || isCurrent}
      className={`w-full py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
        isCurrent
          ? 'bg-gray-900/50 border-2 border-gray-600 text-gray-400 cursor-default'
          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-2 border-blue-500 hover:shadow-lg hover:shadow-blue-500/50'
      }`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Переход к оплате...
        </>
      ) : isCurrent ? (
        <>
          ✓ Текущий тариф
        </>
      ) : (
        <>
          💳 Оплатить
        </>
      )}
    </button>
  );
}
