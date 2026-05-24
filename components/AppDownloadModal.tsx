'use client';
import { useEffect, useState } from 'react';
import { Smartphone, Zap, Monitor, X } from 'lucide-react';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-400 rounded-3xl p-8 max-w-md w-full shadow-2xl">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Smartphone className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Добавьте AI Tools на экран
          </h2>
          <p className="text-gray-400 text-sm">
            Без магазина приложений — прямо с браузера
          </p>
        </div>

        {/* Android */}
        <div className="mb-4 p-4 rounded-2xl bg-slate-700/50 border border-green-400/20">
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="w-4 h-4 text-green-400" />
            <span className="font-bold text-green-400">Android (Chrome)</span>
          </div>
          <ol className="text-sm text-gray-300 space-y-1 list-none">
            <li>1. Открой сайт в <span className="text-white font-semibold">Chrome</span></li>
            <li>2. Нажми <span className="text-white font-semibold">⋮</span> (три точки) вверху справа</li>
            <li>3. Выбери <span className="text-white font-semibold">"Установить приложение"</span></li>
            <li>4. Подтверди — иконка появится на экране</li>
          </ol>
        </div>

        {/* iPhone */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-700/50 border border-blue-400/20">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-blue-400">iPhone (Safari)</span>
          </div>
          <ol className="text-sm text-gray-300 space-y-1 list-none">
            <li>1. Открой сайт в <span className="text-white font-semibold">Safari</span></li>
            <li>2. Нажми кнопку <span className="text-white font-semibold">Поделиться</span> (□↑)</li>
            <li>3. Выбери <span className="text-white font-semibold">"На главный экран"</span></li>
            <li>4. Нажми <span className="text-white font-semibold">Добавить</span></li>
          </ol>
        </div>

        {/* Benefits */}
        <div className="flex gap-4 mb-6 text-xs text-gray-400 justify-center">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-blue-400" />
            Быстрый доступ
          </div>
          <div className="flex items-center gap-1">
            <Smartphone className="w-3 h-3 text-purple-400" />
            Как приложение
          </div>
          <div className="flex items-center gap-1">
            <Monitor className="w-3 h-3 text-emerald-400" />
            Без рекламы
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={() => setIsOpen(false)}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 transition flex items-center justify-center gap-2 mb-3"
        >
          <X className="w-4 h-4" />
          Понятно, закрыть
        </button>

        <div className="text-center">
          <button
            onClick={() => {
              localStorage.setItem('appModalShown', (Date.now() + 30 * 24 * 60 * 60 * 1000).toString());
              setIsOpen(false);
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
