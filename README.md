# leet-tracker

Tell it when your interview is. It does the math.

A NeetCode-150 tracker that turns your target date into a living plan — fall behind and this week's load grows, never a stale schedule. Rate every solve honestly (clean / hints / solution), and the shaky ones come back for review right when you'd forget them.

**→ https://leet150.vercel.app**

---

## how it works

- **pick a date** — pace = problems left ÷ time left, recomputed every visit. Any date is legal. 150 in a week means 22 a day; the app shows the math and gets out of the way.
- **rate the solve** — *clean* / *needed hints* / *read the solution*. One tap. Honesty is free: every level counts the same on the leaderboard.
- **auto review** — solution-reads come back in ~1 week, hint-solves in ~2. Reviews land inside your weekly plan, not a tab you'll never open.
- **guess the pattern** — before a problem opens, commit to a guess (or skip, one tap). Recognizing the pattern cold *is* the interview skill; the patterns tab tracks your hit rate.
- **mastery grid** — pattern × confidence heatmap. Readiness at a glance, not just a percent-complete bar.
- **cheatsheet** — quick notes + time/space complexity per problem, rolled up per pattern. Your own revision doc, written as you go.
- **weekly board** — solved-this-week, resets Monday. Newcomers can top it in week one.
- **tight on time?** — one tap trims the plan to the Blind-75 core. Suggested, never forced.

Progress works straight from the browser with no account; sign in with Google to sync across devices and join the board.

## self-hosting

```bash
git clone https://github.com/joudbitar/leet-tracker.git
cd leet-tracker
npm install
```

Backend is Firebase (free Spark tier — auth + Firestore, never pauses):

1. [Firebase console](https://console.firebase.google.com) → create a project → add a **web app**, copy its config into `.env.local` (see `.env.example`).
2. **Authentication → Sign-in method** → enable Google. Add your domain under Authorized domains.
3. **Firestore** → create a database, then paste `firebase/firestore.rules` in the Rules tab (or `firebase deploy --only firestore:rules`).

Then `npm run dev`. Without `.env.local` the app still runs fully in local-only mode.

PRs welcome.
