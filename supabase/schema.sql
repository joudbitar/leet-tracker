create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  problem_id text not null,
  checked boolean default false,
  note text default '',
  updated_at timestamptz default now(),
  unique(user_id, problem_id)
);

alter table progress enable row level security;

create policy "Users own their progress" on progress
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
