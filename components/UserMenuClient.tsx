'use client';

export default function UserMenuClient({ email }: { email: string }) {
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
