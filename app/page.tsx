import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-[var(--font-display)] text-6xl font-bold mb-4 leading-tight">
        Умные ИИ-инструменты<br className="hidden sm:block" /> для любых задач
      </h1>
      <p className="text-zinc-400 text-lg max-w-xl mb-10">
        Резюме, контент, юридические вопросы, бизнес-идеи — всё в одном месте.
      </p>
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="px-8 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors"
        >
          Попробовать бесплатно
        </Link>
        <Link
          href="/pricing"
          className="px-8 py-3 rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold text-sm transition-colors"
        >
          Тарифы
        </Link>
      </div>
    </main>
  );
}
