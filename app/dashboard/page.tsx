import GeneratorForm from "@/components/GeneratorForm";

export const metadata = { title: "Личный кабинет — AI Tools" };
export const revalidate = 0;

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Личный кабинет</h1>
        <p className="text-zinc-400 mb-10">Выберите инструмент и опишите задачу</p>
        <GeneratorForm />
      </div>
    </main>
  );
}
