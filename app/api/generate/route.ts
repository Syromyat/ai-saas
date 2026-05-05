import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { prompts } from "@/lib/prompts";
import type { ToolId } from "@/lib/tools";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { tool, prompt }: { tool: ToolId; prompt: string } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Введите текст запроса" }, { status: 400 });
    }

    const systemPrompt = prompts[tool] ?? prompts.resume;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    const result =
      message.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { type: "text"; text: string }).text)
        .join("") || "Нет ответа";

    // Сохраняем в историю (не блокируем ответ)
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("generations").insert({ user_id: user.id, tool, prompt, result });
      }
    } catch (e) {
      console.warn("History save failed:", e);
    }

    return NextResponse.json({ result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка генерации. Попробуйте позже." }, { status: 500 });
  }
}
