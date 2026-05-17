import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function UserMenu() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105 text-sm"
      >
        Вход
      </Link>
    );
  }

  const email = user.email ?? '';
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-4">
      {/* Avatar & Email */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800/50 border border-blue-400/20 hover:border-blue-400/50 transition-all">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-xs font-bold text-white shadow-lg">
          {initials}
        </div>
        <div className="hidden sm:block">
          <p className="text-xs text-gray-500">Профиль</p>
          <p className="text-sm text-gray-300 font-semibold">{email.split('@')[0]}</p>
        </div>
      </div>

      {/* Logout Button */}
      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-400/30 transition-all duration-300"
        >
          Выход
        </button>
      </form>
    </div>
  );
}
