import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { prompts } from "@/lib/prompts";
import type { ToolId } from "@/lib/tools";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { tool, prompt }: { tool: ToolId; prompt: string } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Введите текст запроса" }, { status: 400 });
    }

    // Получаем профиль пользователя и его тариф
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (!profile) {
      console.log("DEBUG: Профиль не найден для пользователя:", user.id);
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 });
    }

    // Проверяем тариф
    const plan = profile.plan || "free";
    console.log("DEBUG: Профиль:", JSON.stringify(profile));
    console.log("DEBUG: План:", plan);
    console.log("DEBUG: Тип плана:", typeof plan);
    console.log("DEBUG: Проверка включает план?", ["free", "basic", "pro"].includes(plan));
    
    if (!["free", "basic", "pro"].includes(plan)) {
      console.log("DEBUG: ОШИБКА - тариф не в списке:", plan);
      return NextResponse.json({ error: "Неверный тариф", debug: plan }, { status: 400 });
    }

    const systemPrompt = prompts[tool] ?? prompts.resume;
    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    const result =
      message.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { type: "text"; text: string }).text)
        .join("") || "Нет ответа";

    // Сохраняем в историю
    try {
      await supabase.from("generations").insert({
        user_id: user.id,
        tool,
        prompt,
        result,
      });
    } catch (e) {
      console.warn("История не сохранена:", e);
    }

    return NextResponse.json({ result });
  } catch (e) {
    console.error("Исключение при генерации:", e);
    return NextResponse.json({ error: "Ошибка генерации. Попробуйте позже." }, { status: 500 });
  }
}
