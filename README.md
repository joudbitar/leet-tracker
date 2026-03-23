# leet-tracker

Tracks my progress through the NeetCode 150 on a week-by-week schedule. Built this because spreadsheets are ugly and I kept losing track of where I was.

![leet-tracker screenshot](https://leet-tracker-pied.vercel.app)

**Live:** https://leet-tracker-pied.vercel.app

---

## what it does

- 31-week curriculum from March to November (3 problems/week)
- check off problems as you do them, notes per problem
- progress bars per phase + by topic
- current week auto-highlighted
- sign in with Google to save progress across devices
- streak counter so you feel bad when you skip

## stack

Vite + React + TypeScript. Supabase for auth and storing progress. Deployed on Vercel.

## running locally

```bash
git clone https://github.com/joudbitars/leet-tracker.git
cd leet-tracker
npm install
```

create a `.env.local`:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm run dev
```

## supabase setup

run this in your supabase SQL editor:

```sql
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
```

enable Google OAuth in supabase dashboard → authentication → providers → google.

---

built for personal use, feel free to fork it for your own schedule.
