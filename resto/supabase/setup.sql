create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
grant select on public.users to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.users
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

drop policy if exists "Users can read own profile or admins can read all"
  on public.users;
create policy "Users can read own profile or admins can read all"
  on public.users
  for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    coalesce(new.email, ''),
    'user'
  )
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.users (id, name, email, role)
select
  id,
  coalesce(
    nullif(raw_user_meta_data ->> 'name', ''),
    split_part(coalesce(email, ''), '@', 1)
  ),
  coalesce(email, ''),
  'user'
from auth.users
on conflict (id) do nothing;

-- After registering an account, assign an administrator from the SQL Editor:
-- update public.users set role = 'admin' where email = 'admin@example.com';
