import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { tools } from "@/lib/tools";
import HistoryList from "@/components/HistoryList";

export const metadata = { title: "История — AI Tools" };

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/history");

  const { tool: toolFilter } = await searchParams;

  let query = supabase
    .from("generations")
    .select("id, tool, prompt, result, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (toolFilter && toolFilter !== "all") {
    query = query.eq("tool", toolFilter);
  }

  const { data: generations } = await query;

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">История запросов</h1>
        <p className="text-zinc-400 mb-8">Все ваши генерации сохранены здесь</p>
        <HistoryList
          generations={generations ?? []}
          tools={tools}
          activeFilter={toolFilter ?? "all"}
        />
      </div>
    </main>
  );
}
