-- Roblox Boosting: database schema + row-level security
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'customer' check (role in ('admin','staff','customer')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text generated always as ('RB-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))) stored unique,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  roblox_username text not null,
  current_level integer not null default 0 check (current_level >= 0),
  target_level integer not null check (target_level > 0),
  status text not null default 'created' check (status in ('created','logged_in','ready_to_level','leveling','level_completed','ready_for_sale','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role in ('admin','staff')) $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
 insert into public.profiles(id,email,display_name)
 values(new.id,new.email,coalesce(new.raw_user_meta_data->>'display_name','Customer'));
 return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.orders enable row level security;

drop policy if exists "profile read own or staff" on public.profiles;
create policy "profile read own or staff" on public.profiles for select
using (id = auth.uid() or public.is_staff());

drop policy if exists "customer create own profile" on public.profiles;
create policy "customer update own profile" on public.profiles for update
using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles p where p.id = auth.uid()));

drop policy if exists "orders read own or staff" on public.orders;
create policy "orders read own or staff" on public.orders for select
using (customer_id = auth.uid() or public.is_staff());

drop policy if exists "customer create own order" on public.orders;
create policy "customer create own order" on public.orders for insert
with check (customer_id = auth.uid() and status = 'created');

drop policy if exists "staff update orders" on public.orders;
create policy "staff update orders" on public.orders for update
using (public.is_staff()) with check (public.is_staff());

-- Profiles are created by the trigger. Do not allow public role escalation.
