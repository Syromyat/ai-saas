'use client';

import { useEffect, useState } from 'react';

export default function AppDownloadModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const modalShown = localStorage.getItem('appModalShown');
    const lastShown = modalShown ? parseInt(modalShown) : 0;
    const now = Date.now();

    if (now - lastShown > 7 * 24 * 60 * 60 * 1000) {
      const userAgent = navigator.userAgent.toLowerCase();
      const isApp = userAgent.includes('ai-tools-app');

      if (!isApp) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          localStorage.setItem('appModalShown', now.toString());
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-400 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Приложение удобнее!
          </h2>
          <p className="text-gray-400">
            Скачай приложение AI Tools для ещё большего удобства
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <span className="text-gray-300">Быстрый доступ с главного экрана</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <span className="text-gray-300">Уведомления о начислениях</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <span className="text-gray-300">Работает без интернета (кэш)</span>
          </div>
        </div>

        {/* Download Links */}
        <div className="space-y-3 mb-8">
          
            href="https://play.google.com/store/apps/details?id=com.aitools.app"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-center hover:shadow-lg hover:shadow-green-500/50 transition"
          >
            🤖 Google Play (Android)
          </a>
          
            href="https://apps.apple.com/app/ai-tools/id1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold text-center hover:shadow-lg hover:shadow-gray-500/50 transition"
          >
            🍎 App Store (iOS)
          </a>
        </div>

        {/* Close Button */}
        <button
          onClick={closeModal}
          className="w-full py-3 rounded-lg border-2 border-gray-600 text-gray-300 hover:bg-gray-800/50 transition font-semibold"
        >
          Закрыть
        </button>

        {/* Don't show again */}
        <div className="text-center mt-4">
          <button
            onClick={() => {
              localStorage.setItem('appModalShown', (Date.now() + 30 * 24 * 60 * 60 * 1000).toString());
              closeModal();
            }}
            className="text-xs text-gray-500 hover:text-gray-400 transition"
          >
            Не показывать 30 дней
          </button>
        </div>
      </div>
    </div>
  );
}
