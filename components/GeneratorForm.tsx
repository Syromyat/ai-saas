'use client';

import { useState } from 'react';
import { tools } from '@/lib/tools';
import type { ToolId } from '@/lib/tools';
import ToolCard from './ToolCard';

export default function GeneratorForm() {
  const [tool, setTool] = useState<ToolId>('resume');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Неизвестная ошибка');
      } else {
        setResult(data.result);
      }
    } catch {
      setError('Ошибка сети. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Tool Selector */}
      <div>
        <h3 className="text-lg font-bold mb-4">Выберите инструмент</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((t) => (
            <ToolCard
              key={t.id}
              tool={t}
              selected={tool === t.id}
              onSelect={setTool}
            />
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div>
        <label className="block text-sm font-semibold mb-3">Ваш запрос</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Опишите то, что вам нужно. Чем подробнее, тем лучше результат..."
          rows={6}
          className="w-full px-6 py-4 rounded-2xl bg-slate-900/50 border border-blue-400/20 focus:border-blue-400/50 focus:outline-none transition-all text-white placeholder-gray-500 resize-none font-mono text-sm"
        />
        <p className="text-xs text-gray-500 mt-2">Максимум 2000 символов</p>
      </div>

      {/* Generate Button */}
      <button
        onClick={generate}
        disabled={loading || !prompt.trim()}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all transform hover:scale-105 active:scale-95"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Генерируем результат...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            ✨ Сгенерировать результат
          </span>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-400/30 text-red-300">
          <div className="flex gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold mb-1">Ошибка</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30">
            <p className="text-sm text-green-300 font-semibold mb-2">✓ Результат готов</p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold">Ваш результат</h4>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  alert('Результат скопирован!');
                }}
                className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 transition-all text-sm font-semibold"
              >
                📋 Копировать
              </button>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-200 whitespace-pre-wrap leading-relaxed font-mono text-sm bg-slate-900/50 p-4 rounded-lg border border-blue-400/10">
                {result}
              </p>
            </div>

            {/* Additional Actions */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => {
                  setPrompt('');
                  setResult(null);
                }}
                className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-all text-sm font-semibold"
              >
                🔄 Новый запрос
              </button>
              <button
                onClick={() => setResult(null)}
                className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-all text-sm font-semibold"
              >
                ✕ Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-400/30">
        <h4 className="font-bold mb-3 text-blue-300">💡 Советы для лучшего результата:</h4>
        <ul className="text-sm text-gray-300 space-y-2">
          <li>✓ Будьте конкретны в описании задачи</li>
          <li>✓ Укажите контекст и цель</li>
          <li>✓ Добавьте требования и пожелания</li>
          <li>✓ Используйте правильное форматирование</li>
        </ul>
      </div>
    </div>
  );
}
