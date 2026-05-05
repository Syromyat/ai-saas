"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Tool } from "@/lib/tools";

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
  resume:    "📄 Резюме",
  instagram: "📱 Контент",
  congrats:  "🎉 Поздравления",
  business:  "💡 Бизнес",
  legal:     "⚖️ Юрист",
  tutor:     "🎓 Репетитор",
};

export default function HistoryList({ generations, tools, activeFilter }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  function setFilter(val: string) {
    const params = new URLSearchParams();
    if (val !== "all") params.set("tool", val);
    router.push(`${pathname}?${params.toString()}`);
  }

  function copyResult(id: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      {/* Фильтры */}
      <div className="flex flex-wrap gap-2 mb-8">
        <FilterChip
          label="Все"
          active={activeFilter === "all"}
          onClick={() => setFilter("all")}
        />
        {tools.map((t) => (
          <FilterChip
            key={t.id}
            label={`${t.icon} ${t.name.replace("ИИ ", "")}`}
            active={activeFilter === t.id}
            onClick={() => setFilter(t.id)}
          />
        ))}
      </div>

      {/* Список */}
      {generations.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-4xl mb-4">🗂️</p>
          <p className="text-lg">История пуста</p>
          <p className="text-sm mt-2">Сделайте первый запрос в кабинете</p>
        </div>
      ) : (
        <div className="space-y-3">
          {generations.map((g) => {
            const isOpen = expanded === g.id;
            const date = new Date(g.created_at);
            return (
              <div
                key={g.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all"
              >
                {/* Header */}
                <button
                  onClick={() => setExpanded(isOpen ? null : g.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-zinc-800/50 transition-colors"
                >
                  <span className="text-lg shrink-0">
                    {tools.find((t) => t.id === g.tool)?.icon ?? "🤖"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{g.prompt}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {TOOL_LABELS[g.tool] ?? g.tool} ·{" "}
                      {date.toLocaleDateString("ru-RU", {
                        day: "numeric", month: "short",
                      })}{" "}
                      {date.toLocaleTimeString("ru-RU", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="text-zinc-600 text-xs shrink-0">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </button>

                {/* Expanded result */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-zinc-800">
                    <p className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mt-4 mb-2">
                      Запрос
                    </p>
                    <p className="text-sm text-zinc-300 whitespace-pre-wrap mb-4">
                      {g.prompt}
                    </p>
                    <p className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-2">
                      Результат
                    </p>
                    <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
                      {g.result}
                    </p>
                    <button
                      onClick={() => copyResult(g.id, g.result)}
                      className={`mt-4 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        copied === g.id
                          ? "border-green-700 text-green-400 bg-green-900/20"
                          : "border-zinc-700 text-zinc-400 hover:border-violet-500 hover:text-violet-400"
                      }`}
                    >
                      {copied === g.id ? "✓ Скопировано" : "Копировать результат"}
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
      className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-violet-600 border-violet-600 text-white"
          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
