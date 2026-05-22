import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { recordPartnerEarning } from '@/lib/partner-tracking';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Проверяем что это от ЮKassa
    const event = body.event;
    const payment = body.object;

    if (!event || !payment) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Обрабатываем только успешные платежи
    if (event !== 'payment.succeeded' || payment.status !== 'succeeded') {
      return NextResponse.json({ ok: true });
    }

    const supabase = await createClient();

    // Получаем метаданные платежа
    const metadata = payment.metadata || {};
    const userId = metadata.userId;
    const planId = metadata.planId;

    if (!userId || !planId) {
      console.error('Missing userId or planId in metadata');
      return NextResponse.json({ ok: true });
    }

    // Получаем сумму платежа
    const amount = parseFloat(payment.amount.value);

    // Обновляем план пользователя
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        plan: planId,
        subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return NextResponse.json({ ok: true });
    }

    // ✅ НОВОЕ: Записываем заработок партнёру
    console.log(`Recording partner earning for user ${userId}, plan ${planId}, amount ${amount}`);
    await recordPartnerEarning(supabase, userId, amount, planId);

    // Отправляем уведомление (опционально)
    console.log(`✓ Payment processed for user ${userId}, plan: ${planId}, amount: ${amount}₽`);

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook error:', errorMessage);
    return NextResponse.json({ ok: true }); // Возвращаем 200 чтобы ЮKassa не переслал
  }
}
