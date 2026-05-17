'use client';

import type { Tool } from '@/lib/tools';

interface Props {
  tool: Tool;
  selected: boolean;
  onSelect: (id: Tool['id']) => void;
}

export default function ToolCard({ tool, selected, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(tool.id)}
      className={`
        relative group text-left rounded-2xl p-5 border transition-all duration-300 overflow-hidden
        ${
          selected
            ? 'border-blue-400 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/20'
            : 'border-blue-400/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10'
        }
      `}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">
          {tool.icon}
        </span>
        <h4 className={`font-bold text-sm mb-1 transition-colors duration-300 ${
          selected ? 'text-blue-300' : 'text-white group-hover:text-blue-300'
        }`}>
          {tool.name}
        </h4>
        <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
          {tool.description}
        </p>
      </div>

      {/* Selection Indicator */}
      {selected && (
        <div className="absolute top-3 right-3 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
          ✓
        </div>
      )}
    </button>
  );
}
