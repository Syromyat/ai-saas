import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Вход — AI Tools" };

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Tools</h1>
          <p className="text-zinc-400 text-sm">Войдите или создайте аккаунт</p>
        </div>
        <Suspense>
          <AuthForm />
        </Suspense>
      </div>
    </main>
  );
}
 
