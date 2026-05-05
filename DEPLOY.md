# Деплой на Vercel — пошаговая инструкция

## Предварительные требования

- Аккаунт на [GitHub](https://github.com)
- Аккаунт на [Vercel](https://vercel.com)
- Аккаунт на [Supabase](https://supabase.com)
- Аккаунт в [ЮKassa](https://yookassa.ru)

---

## Шаг 1 — Supabase: создать проект и БД

1. Зайдите на [supabase.com](https://supabase.com) → **New project**
2. Запишите:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Откройте **SQL Editor** и выполните по очереди:
   - `supabase/migrations/001_init.sql`
   - `supabase/migrations/002_payments.sql`
4. Перейдите в **Authentication → Providers**:
   - Включите **Email** (подтверждение по почте)
   - Включите **Google** (вставьте Client ID и Secret из Google Console)
5. Перейдите в **Authentication → URL Configuration**:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/api/auth/callback`

---

## Шаг 2 — GitHub: залить код

```bash
# В папке проекта
git init
git add .
git commit -m "init: ai saas"

# Создайте репозиторий на github.com, затем:
git remote add origin https://github.com/YOUR_USER/ai-saas.git
git push -u origin main
```

---

## Шаг 3 — Vercel: подключить репозиторий

1. Зайдите на [vercel.com](https://vercel.com) → **Add New Project**
2. Выберите ваш GitHub репозиторий `ai-saas`
3. Framework: **Next.js** (определится автоматически)
4. Нажмите **Environment Variables** и добавьте все переменные из `.env.local.example`:

| Переменная | Где взять |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `NEXT_PUBLIC_BASE_URL` | `https://your-app.vercel.app` |
| `YUKASSA_SHOP_ID` | ЮKassa → Настройки → Ключи API |
| `YUKASSA_SECRET_KEY` | ЮKassa → Настройки → Ключи API |

5. Нажмите **Deploy** → дождитесь сборки (~2 мин)

---

## Шаг 4 — Обновить BASE_URL

После деплоя Vercel покажет URL вида `https://ai-saas-xxx.vercel.app`:

1. В Vercel → Settings → Environment Variables:
   - Обновите `NEXT_PUBLIC_BASE_URL` на реальный URL
2. В Supabase → Authentication → URL Configuration:
   - Обновите Site URL и Redirect URL на реальный URL
3. Нажмите **Redeploy** в Vercel

---

## Шаг 5 — ЮKassa: настроить вебхук

1. Зайдите в [ЮKassa](https://yookassa.ru) → Интеграция → HTTP-уведомления
2. Добавьте URL: `https://your-app.vercel.app/api/payment/webhook`
3. Событие: `payment.succeeded`
4. Сохраните

---

## Шаг 6 — Проверка

Откройте `https://your-app.vercel.app` и проверьте:

- [ ] Регистрация / вход работает
- [ ] Письмо подтверждения приходит
- [ ] Генерация ИИ работает
- [ ] История сохраняется
- [ ] Реферальная ссылка генерируется
- [ ] Тестовая оплата проходит (используйте тестовую карту ЮKassa: `5555555555554477`)

---

## Кастомный домен (опционально)

1. Vercel → Settings → Domains → Add Domain
2. Добавьте DNS-запись у вашего регистратора (Vercel покажет инструкцию)
3. Обновите `NEXT_PUBLIC_BASE_URL`, Supabase URLs и ЮKassa webhook на новый домен

---

## Автодеплой

После настройки каждый `git push origin main` автоматически запускает новый деплой на Vercel.

```bash
# Обновить продакшн
git add .
git commit -m "feat: новая функция"
git push
```
