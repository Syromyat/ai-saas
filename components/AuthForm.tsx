"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateReferralCode } from "@/lib/referral";

type Mode = "login" | "register";

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") ?? null;
  const next = searchParams.get("next") ?? "/dashboard";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const supabase = createClient();

  async function handleSubmit() {
    setLoading(true);
    setMessage(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: "error", text: "Неверный email или пароль" });
      } else {
        router.push(next);
        router.refresh();
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/api/auth/callback?next=${next}` },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else if (data.user) {
        // Создаём профиль с реферальным кодом
        const myCode = generateReferralCode(data.user.id);
        await supabase.from("profiles").insert({
          id: data.user.id,
          email,
          referral_code: myCode,
          referred_by: refCode ?? null,
          plan: "free",
          subscription_end: null,
        });

        // Если пришёл по реф-ссылке — записываем в таблицу рефералов
        if (refCode) {
          await supabase.from("referrals").insert({
            ref_code: refCode,
            invited_user_id: data.user.id,
            invited_email: email,
          });
        }

        setMessage({
          type: "success",
          text: "Подтвердите email — проверьте почту и нажмите ссылку.",
        });
      }
    }

    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/api/auth/callback?next=${next}` },
    });
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-5">
      {/* Toggle */}
      <div className="flex rounded-xl border border-zinc-800 overflow-hidden">
        {(["login", "register"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setMessage(null); }}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              mode === m
                ? "bg-violet-600 text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            {m === "login" ? "Войти" : "Регистрация"}
          </button>
        ))}
      </div>

      {/* Google */}
      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Продолжить через Google
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs text-zinc-600">или</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Fields */}
      <div className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-violet-500 transition-colors"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-violet-500 transition-colors"
        />
      </div>

      {/* Referral notice */}
      {refCode && mode === "register" && (
        <p className="text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-2">
          Вы регистрируетесь по реферальной ссылке — ваш друг получит бонус после первой оплаты.
        </p>
      )}

      {message && (
        <p className={`text-sm rounded-xl px-4 py-3 ${
          message.type === "error"
            ? "bg-red-900/30 border border-red-800 text-red-300"
            : "bg-green-900/30 border border-green-800 text-green-300"
        }`}>
          {message.text}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !email || !password}
        className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
      >
        {loading ? "..." : mode === "login" ? "Войти" : "Создать аккаунт"}
      </button>
    </div>
  );
}
