'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Tool } from '@/lib/tools';

interface Generation {
  id: number;
  tool: string;
  prompt: string;
  result: string;
  created_at: string;
}

interface Props {
  generations: Generation[];
  tools: Tool[];
  activeFilter: string;
}

const TOOL_LABELS: Record<string, string> = {
  resume: '📄 Резюме',
  instagram: '📱 Контент',
  congrats: '🎉 Поздравления',
  business: '💡 Бизнес',
  legal: '⚖️ Юрист',
  tutor: '🎓 Репетитор',
};

export default function HistoryList({ generations, tools, activeFilter }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  function setFilter(val: string) {
    const params = new URLSearchParams();
    if (val !== 'all') params.set('tool', val);
    router.push(`${pathname}?${params.toString()}`);
  }

  function copyResult(id: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3 mb-8">
        <FilterChip
          label="Все"
          active={activeFilter === 'all'}
          onClick={() => setFilter('all')}
        />
        {tools.map((t) => (
          <FilterChip
            key={t.id}
            label={`${t.icon} ${t.name.replace('ИИ ', '')}`}
            active={activeFilter === t.id}
            onClick={() => setFilter(t.id)}
          />
        ))}
      </div>

      {/* History List */}
      {generations.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-6">📭</div>
          <h3 className="text-xl font-bold mb-2">История пуста</h3>
          <p className="text-gray-400">Сделайте первый запрос в личном кабинете, чтобы увидеть историю</p>
        </div>
      ) : (
        <div className="space-y-4">
          {generations.map((g) => {
            const isOpen = expanded === g.id;
            const date = new Date(g.created_at);
            const toolIcon = tools.find((t) => t.id === g.tool)?.icon ?? '🤖';

            return (
              <div
                key={g.id}
                className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-blue-400 bg-gradient-to-br from-slate-800/50 to-slate-900/50 shadow-lg shadow-blue-500/10'
                    : 'border-blue-400/20 bg-gradient-to-br from-slate-800/30 to-slate-900/30 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10'
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpanded(isOpen ? null : g.id)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-slate-700/30 transition-all duration-300"
                >
                  <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                    {toolIcon}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                      {g.prompt}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="text-blue-400">{TOOL_LABELS[g.tool] ?? g.tool}</span>
                      {' '} • {' '}
                      <span>
                        {date.toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        {date.toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </p>
                  </div>

                  <div className="text-gray-400 group-hover:text-blue-400 transition-colors shrink-0">
                    {isOpen ? '▲' : '▼'}
                  </div>
                </button>

                {/* Expanded Content */}
                {isOpen && (
                  <div className="px-6 pb-6 border-t border-blue-400/10 pt-6 space-y-6 bg-gradient-to-b from-slate-800/20 to-slate-900/40">
                    {/* Prompt Section */}
                    <div>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
                        📝 Ваш запрос
                      </p>
                      <div className="p-4 rounded-lg bg-slate-900/50 border border-blue-400/10">
                        <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed font-mono">
                          {g.prompt}
                        </p>
                      </div>
                    </div>

                    {/* Result Section */}
                    <div>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
                        ✨ Результат
                      </p>
                      <div className="p-4 rounded-lg bg-slate-900/50 border border-blue-400/10">
                        <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed font-mono">
                          {g.result}
                        </p>
                      </div>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => copyResult(g.id, g.result)}
                      className={`w-full py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
                        copied === g.id
                          ? 'bg-green-500/20 border border-green-400/50 text-green-300'
                          : 'bg-blue-500/20 border border-blue-400/50 text-blue-300 hover:bg-blue-500/30'
                      }`}
                    >
                      {copied === g.id ? '✓ Скопировано в буфер' : '📋 Копировать результат'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-sm px-5 py-2 rounded-lg font-semibold transition-all duration-300 ${
        active
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
          : 'bg-slate-800/50 border border-blue-400/20 text-gray-400 hover:border-blue-400/50 hover:text-gray-200'
      }`}
    >
      {label}
    </button>
  );
}
