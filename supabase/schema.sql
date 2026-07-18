-- Fresh-install schema (v2). Existing v1 databases should run
-- migrations/002_v2.sql instead — it migrates old data in place.

create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  problem_id text not null,
  checked boolean default false, -- legacy; v2 derives it from confidence
  note text default '',
  confidence text check (confidence in ('clean','hints','solution')),
  solved_at timestamptz,
  guessed_pattern text,
  guess_correct boolean,
  time_complexity text,
  space_complexity text,
  updated_at timestamptz default now(),
  unique(user_id, problem_id)
);

alter table progress enable row level security;

create policy "Users own their progress" on progress
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists profiles (
  user_id uuid primary key references auth.users on delete cascade,
  display_name text not null default '',
  target_date date,
  core_only boolean not null default false,
  show_on_leaderboard boolean not null default true,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users own their profile" on profiles
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- security definer so it can aggregate across users; exposes only short display
-- names + counts, and only for people who opted in. Resets every Monday.
create or replace function weekly_leaderboard()
returns table(display_name text, solved bigint)
language sql
security definer
set search_path = public
stable
as $$
  select pf.display_name, count(*) as solved
  from progress pr
  join profiles pf on pf.user_id = pr.user_id
  where pr.confidence is not null
    and pr.solved_at >= date_trunc('week', now())
    and pf.show_on_leaderboard
    and pf.display_name <> ''
  group by pf.user_id, pf.display_name
  order by solved desc, display_name
  limit 100;
$$;

grant execute on function weekly_leaderboard() to anon, authenticated;
