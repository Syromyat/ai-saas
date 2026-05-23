import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { email, password, name, telegram } = await req.json();

    // Используем service role key для создания пользователя без подтверждения email
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Создаём пользователя через admin API (email сразу подтверждён)
    const { data: userData, error: userError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    const userId = userData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Ошибка создания пользователя' }, { status: 400 });
    }

    // 2. Генерируем реферальный код
    const referralCode = `partner_${Math.random().toString(36).substring(2, 10)}`;

    // 3. Создаём партнёра в БД
    const { error: partnerError } = await adminSupabase.from('partners').insert({
      user_id: userId,
      email,
      name,
      telegram,
      referral_code: referralCode,
      commission_percent: 20,
    });

    if (partnerError) {
      return NextResponse.json({ error: partnerError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
