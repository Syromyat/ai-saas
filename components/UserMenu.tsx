import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function UserMenu() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm px-4 py-1.5 rounded-full border border-zinc-700 text-zinc-300 hover:border-violet-500 hover:text-white transition-colors"
      >
        Войти
      </Link>
    );
  }

  const email = user.email ?? "";
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-xs font-semibold text-violet-300">
        {initials}
      </div>
      <span className="text-sm text-zinc-400 hidden sm:block">{email}</span>
      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          Выйти
        </button>
      </form>
    </div>
  );
}
