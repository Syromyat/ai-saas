import ReferralWidget from "@/components/ReferralWidget";

export const metadata = { title: "Партнёрская программа — AI Tools" };

export default function ReferralPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Партнёрская программа</h1>
        <p className="text-zinc-400 mb-10">Приглашайте друзей и получайте бесплатные месяцы подписки</p>
        <ReferralWidget />
      </div>
    </main>
  );
}
