'use client';

import { useState } from 'react';
import type { PlanId } from '@/lib/yukassa';

interface Props {
  planId: PlanId | null;
  currentPlan?: string;
  planName?: string;
}

export default function BuyButton({ planId, currentPlan, planName }: Props) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!planId) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-lg text-sm font-semibold border-2 border-gray-600 text-gray-500 cursor-default bg-gray-900/50 transition-all"
      >
        {currentPlan === 'free' ? '✓ Текущий тариф' : 'Текущий тариф'}
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
        setShowConfirm(false);
      }
    } catch {
      alert('Ошибка сети');
      setLoading(false);
      setShowConfirm(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading || isCurrent}
        className={`w-full py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
          isCurrent
            ? 'bg-gray-900/50 border-2 border-gray-600 text-gray-400 cursor-default'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-2 border-blue-500 hover:shadow-lg hover:shadow-blue-500/50'
        }`}
      >
        {isCurrent ? (
          '✓ Текущий тариф'
        ) : (
          '🚀 Попробовать'
        )}
      </button>

      {/* Confirmation Modal */}
      {showConfirm && !isCurrent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-400/30 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">
              Выбрать тариф
            </h3>
            <p className="text-gray-400 mb-8">
              Вы будете перенаправлены на страницу оплаты
            </p>

            {/* Plan Details - БЕЗ КАРТЫ */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 mb-8">
              <p className="text-sm text-gray-400 mb-2">Выбранный тариф:</p>
              <p className="text-3xl font-bold text-blue-300">{planName}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800/50 transition font-semibold"
              >
                Отменить
              </button>
              <button
                onClick={handleBuy}
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Переход...
                  </>
                ) : (
                  '✓ Перейти на оплату'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
