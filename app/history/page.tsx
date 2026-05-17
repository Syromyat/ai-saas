'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const getHistory = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        setHistory(data || []);
      }
      setLoading(false);
    };

    getHistory();
  }, []);

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.tool === filter);

  const tools = ['resume', 'content', 'ideas', 'congratulations', 'legal', 'tutor'];
  const toolNames: { [key: string]: string } = {
    resume: '📄 Резюме',
    content: '✍️ Контент',
    ideas: '💡 Идеи',
    congratulations: '🎉 Поздравления',
    legal: '⚖️ Правовая помощь',
    tutor: '🎓 Репетитор'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Загрузка истории...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white py-12 px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            История <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">запросов</span>
          </h1>
          <p className="text-gray-400">Все ваши созданные запросы и результаты</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all font-semibold ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                : 'bg-slate-800/50 border border-blue-400/20 hover:border-blue-400/50'
            }`}
          >
            Все ({history.length})
          </button>
          {tools.map(tool => {
            const count = history.filter(h => h.tool === tool).length;
            return count > 0 ? (
              <button
                key={tool}
                onClick={() => setFilter(tool)}
                className={`px-4 py-2 rounded-lg transition-all font-semibold ${
                  filter === tool
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-slate-800/50 border border-blue-400/20 hover:border-blue-400/50'
                }`}
              >
                {toolNames[tool]} ({count})
              </button>
            ) : null;
          })}
        </div>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">История пуста</h3>
              <p className="text-gray-400 mb-6">Начните создавать запросы в личном кабинете</p>
              <Link href="/dashboard" className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                Перейти в кабинет
              </Link>
            </div>
          ) : (
            filteredHistory.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/20 hover:border-blue-400/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{toolNames[item.tool]?.split(' ')[0]}</div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-blue-400 transition">
                        {toolNames[item.tool]?.split(' ').slice(1).join(' ')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300">
                    {toolNames[item.tool]}
                  </div>
                </div>

                {/* Prompt */}
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Ваш запрос:</p>
                  <p className="text-gray-300 line-clamp-2">{item.prompt}</p>
                </div>

                {/* Result */}
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Результат:</p>
                  <div className="p-3 rounded-lg bg-slate-700/50 text-gray-200 line-clamp-3 text-sm">
                    {item.result}
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => navigator.clipboard.writeText(item.result)}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 transition-all"
                >
                  📋 Копировать результат
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
