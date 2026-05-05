-- Запустите в Supabase > SQL Editor после 001_init.sql

-- История платежей
create table if not exists public.payments (
  id              text primary key,        -- ЮKassa payment ID
  user_id         uuid references auth.users(id),
  plan_id         text not null,
  amount          numeric not null,
  status          text not null default 'pending',
  created_at      timestamptz default now(),
  succeeded_at    timestamptz
);

alter table public.payments enable row level security;
create policy "own payments" on public.payments for select using (auth.uid() = user_id);
