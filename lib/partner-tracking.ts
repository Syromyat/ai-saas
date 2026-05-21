/**
 * Система отслеживания рефералов
 * Сохраняет информацию о том, откуда пришёл пользователь
 */

export interface ReferralData {
  partner_id?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referral_code?: string;
}

const TRACKING_COOKIE_NAME = 'referral_partner';
const TRACKING_COOKIE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 дней

/**
 * Получает реферальные параметры из URL
 */
export function getReferralFromURL(): ReferralData {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const referralCode = params.get('ref');
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');

  // Определяем источник трафика
  let source = 'direct';
  if (utmSource) source = utmSource.toLowerCase();
  else if (referralCode) source = 'referral';

  return {
    referral_code: referralCode || undefined,
    source: source || undefined,
    utm_source: utmSource || undefined,
    utm_medium: utmMedium || undefined,
    utm_campaign: utmCampaign || undefined,
  };
}

/**
 * Сохраняет реферальные данные в cookie
 */
export function saveReferralToCookie(referralData: ReferralData) {
  if (typeof window === 'undefined') return;

  const expiryDate = new Date(Date.now() + TRACKING_COOKIE_EXPIRY);
  const cookieValue = JSON.stringify(referralData);

  document.cookie = `${TRACKING_COOKIE_NAME}=${encodeURIComponent(cookieValue)}; expires=${expiryDate.toUTCString()}; path=/`;
}

/**
 * Получает реферальные данные из cookie
 */
export function getReferralFromCookie(): ReferralData {
  if (typeof window === 'undefined') return {};

  const name = `${TRACKING_COOKIE_NAME}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) {
      const cookieValue = cookie.substring(name.length, cookie.length);
      try {
        return JSON.parse(decodeURIComponent(cookieValue));
      } catch (e) {
        return {};
      }
    }
  }

  return {};
}

/**
 * Очищает реферальные cookie
 */
export function clearReferralCookie() {
  if (typeof window === 'undefined') return;
  document.cookie = `${TRACKING_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

/**
 * Инициализирует отслеживание при загрузке страницы
 */
export function initializeTracking() {
  if (typeof window === 'undefined') return;

  // Проверяем URL параметры
  const urlReferral = getReferralFromURL();

  if (urlReferral.referral_code || urlReferral.utm_source) {
    // Если есть новые параметры - сохраняем их
    saveReferralToCookie(urlReferral);
  } else {
    // Если нет - используем старые из cookie
    const savedReferral = getReferralFromCookie();
    if (Object.keys(savedReferral).length === 0) {
      // Если и cookie пусто - это прямой трафик
      saveReferralToCookie({ source: 'direct' });
    }
  }
}

/**
 * Определяет источник по Referrer
 */
export function detectSourceFromReferrer(): string {
  if (typeof window === 'undefined') return 'direct';

  const referrer = document.referrer;
  if (!referrer) return 'direct';

  if (referrer.includes('t.me')) return 'telegram';
  if (referrer.includes('vk.com')) return 'vk';
  if (referrer.includes('instagram.com')) return 'instagram';
  if (referrer.includes('youtube.com')) return 'youtube';
  if (referrer.includes('google.com')) return 'google';
  if (referrer.includes('yandex.ru')) return 'yandex';
  if (referrer.includes('facebook.com')) return 'facebook';

  return 'other';
}

/**
 * Сохраняет реферальные данные в Supabase при регистрации
 */
export async function saveReferralToDatabase(
  supabase: any,
  userId: string,
  partnerEmail?: string
) {
  try {
    const referralData = getReferralFromCookie();

    // Если есть реферальный код - ищем партнёра
    let partnerId = null;

    if (referralData.referral_code) {
      const { data: partnerData } = await supabase
        .from('partners')
        .select('id')
        .eq('referral_code', referralData.referral_code)
        .single();

      partnerId = partnerData?.id;
    }

    // Создаём запись в partner_referrals
    if (partnerId) {
      const { error } = await supabase.from('partner_referrals').insert({
        partner_id: partnerId,
        user_id: userId,
        source: referralData.source || 'direct',
        utm_source: referralData.utm_source,
        utm_medium: referralData.utm_medium,
        utm_campaign: referralData.utm_campaign,
        status: 'registered',
      });

      if (error) {
        console.error('Ошибка сохранения реферрала:', error);
      }

      return partnerId;
    }

    return null;
  } catch (error) {
    console.error('Ошибка в saveReferralToDatabase:', error);
    return null;
  }
}

/**
 * Сохраняет информацию о платеже партнёру
 */
export async function recordPartnerEarning(
  supabase: any,
  userId: string,
  amount: number,
  planType: string
) {
  try {
    // Получаем реферальную информацию пользователя
    const { data: referralData } = await supabase
      .from('partner_referrals')
      .select('partner_id')
      .eq('user_id', userId)
      .single();

    if (!referralData?.partner_id) return;

    const partnerId = referralData.partner_id;

    // Получаем партнёра для расчёта комиссии
    const { data: partnerData } = await supabase
      .from('partners')
      .select('commission_percent')
      .eq('id', partnerId)
      .single();

    if (!partnerData) return;

    const commissionPercent = partnerData.commission_percent || 20;
    const commission = (amount * commissionPercent) / 100;

    // Создаём запись о начислении
    const { error } = await supabase.from('partner_earnings').insert({
      partner_id: partnerId,
      user_id: userId,
      referral_id: referralData.id,
      amount: amount,
      commission: commission,
      plan_type: planType,
      status: 'completed',
    });

    if (error) {
      console.error('Ошибка записи заработка:', error);
      return;
    }

    // Обновляем статус реферрала
    await supabase
      .from('partner_referrals')
      .update({ status: 'paid' })
      .eq('user_id', userId);

    console.log(`✓ Партнёру начислено ${commission}₽`);
  } catch (error) {
    console.error('Ошибка в recordPartnerEarning:', error);
  }
}
