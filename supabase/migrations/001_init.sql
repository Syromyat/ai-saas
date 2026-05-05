-- Запустите этот SQL в Supabase > SQL Editor

-- Профили пользователей
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  plan        text not null default 'free',      -- 'free' | 'basic' | 'pro'
  subscription_end timestamptz,
  referral_code text unique not null,
  referred_by text,                              -- код того, кто пригласил
  created_at  timestamptz default now()
);

-- Реферальные записи
create table if not exists public.referrals (
  id              bigserial primary key,
  ref_code        text not null,                 -- код владельца
  invited_user_id uuid references auth.users(id),
  invited_email   text not null,
  subscribed_at   timestamptz,
  reward_granted  boolean default false,
  created_at      timestamptz default now()
);

-- История запросов к ИИ
create table if not exists public.generations (
  id         bigserial primary key,
  user_id    uuid references auth.users(id),
  tool       text not null,
  prompt     text not null,
  result     text,
  created_at timestamptz default now()
);

-- RLS — пользователь видит только свои данные
alter table public.profiles    enable row level security;
alter table public.referrals   enable row level security;
alter table public.generations enable row level security;

create policy "own profile"    on public.profiles    for all using (auth.uid() = id);
create policy "own referrals"  on public.referrals   for all using (auth.uid() = invited_user_id);
create policy "own generations" on public.generations for all using (auth.uid() = user_id);
