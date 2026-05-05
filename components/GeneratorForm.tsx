"use client";

import { useState } from "react";
import { tools } from "@/lib/tools";
import type { ToolId } from "@/lib/tools";
import ToolCard from "./ToolCard";

export default function GeneratorForm() {
  const [tool, setTool] = useState<ToolId>("resume");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Неизвестная ошибка");
      } else {
        setResult(data.result);
      }
    } catch {
      setError("Ошибка сети. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Tool selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {tools.map((t) => (
          <ToolCard
            key={t.id}
            tool={t}
            selected={tool === t.id}
            onSelect={setTool}
          />
        ))}
      </div>

      {/* Prompt */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Опишите задачу..."
        rows={5}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm text-white placeholder:text-zinc-500 resize-none outline-none focus:border-violet-500 transition-colors"
      />

      <button
        onClick={generate}
        disabled={loading || !prompt.trim()}
        className="px-8 py-3 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
      >
        {loading ? "Генерация..." : "Сгенерировать"}
      </button>

      {/* Error */}
      {error && (
        <div className="rounded-2xl bg-red-900/30 border border-red-800 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3 font-semibold">
            Результат
          </p>
          <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}
