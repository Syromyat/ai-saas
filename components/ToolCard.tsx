"use client";

import type { Tool } from "@/lib/tools";

interface Props {
  tool: Tool;
  selected: boolean;
  onSelect: (id: Tool["id"]) => void;
}

export default function ToolCard({ tool, selected, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(tool.id)}
      className={`
        text-left rounded-2xl p-4 border transition-all duration-150
        ${
          selected
            ? "border-violet-500 bg-violet-500/10"
            : "border-zinc-800 bg-zinc-900 hover:border-violet-500/50 hover:bg-violet-500/5"
        }
      `}
    >
      <span className="text-2xl block mb-2">{tool.icon}</span>
      <p className="font-semibold text-sm text-white">{tool.name}</p>
      <p className="text-xs text-zinc-400 mt-1">{tool.description}</p>
    </button>
  );
}
