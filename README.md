# leet-tracker

A free progress tracker for CS students grinding through the NeetCode 150. Sign in with Google, check off problems as you solve them, leave notes, and watch your progress stack up week by week.

**→ https://leet-tracker-pied.vercel.app**

No setup needed. Just open it, sign in, and start tracking.

---

## the curriculum

31 weeks, 3 problems a week, structured so you build up from the basics before hitting the hard stuff:

- **Phase 1** (7 weeks) — Arrays, Hashmaps, Two Pointers, Sliding Window, Stacks
- **Phase 2** (14 weeks) — Binary Search, Trees, Linked Lists, Heaps, Backtracking  
- **Phase 3** (10 weeks) — Graphs, Dynamic Programming, Tries

Timed to have you interview-ready by October, which is when FAANG applications go live.

## features

- sign in with Google — your progress saves and syncs across devices
- check off problems as you do them
- leave a quick note per problem (approach, gotcha, etc.)
- current week auto-highlighted so you always know where you are
- per-phase progress bars + topic breakdown sidebar
- streak counter
- countdown to when FAANG apps open

## for students

Anyone can use this. Just go to the link, sign in with your Google account, and your progress is yours — separate from everyone else's. Multiple people can use it at the same time.

The curriculum follows the [NeetCode 150](https://neetcode.io) problem set. Each problem links directly to NeetCode so you can solve it right there.

---

## self-hosting / contributing

If you want to run your own version or tweak the curriculum:

```bash
git clone https://github.com/joudbitar/leet-tracker.git
cd leet-tracker
npm install
```

`.env.local`:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm run dev
```

Supabase schema is in `supabase/schema.sql`. Enable Google OAuth in your Supabase dashboard under Authentication → Providers.

PRs welcome if you want to add problems, fix bugs, or change the schedule.
