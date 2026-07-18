# leet-tracker

Tell it when your interview is. It does the math.

A NeetCode-150 tracker. Pick a target date and the list becomes a weekly plan that recomputes as you go. Rate each solve and the shaky ones come back for review before you forget them.

**→ https://leet150.vercel.app**

---

## how it works

- pick a date. pace = problems left ÷ time left, recomputed every visit. any date is legal.
- rate each solve: clean, hints, or solution. one tap.
- solution reads come back for review in about a week, hint solves in two.
- guess the pattern before opening a problem. the patterns tab tracks your hit rate.
- mastery grid: pattern × confidence at a glance.
- notes and time/space complexity per problem, grouped into a per-pattern cheatsheet.
- weekly leaderboard, resets monday. all ratings count the same.
- tight timeline? one tap trims the plan to the Blind 75.

Works without an account, saved in the browser. Sign in with Google to sync across devices and join the board.

## self-hosting

```bash
git clone https://github.com/joudbitar/leet-tracker.git
cd leet-tracker
npm install
```

Backend is Firebase (free Spark tier, auth + Firestore):

1. [Firebase console](https://console.firebase.google.com): create a project, add a **web app**, copy its config into `.env.local` (see `.env.example`).
2. **Authentication → Sign-in method**: enable Google. Add your domain under Authorized domains.
3. **Firestore**: create a database, then paste `firebase/firestore.rules` in the Rules tab (or `firebase deploy --only firestore:rules`).

Then `npm run dev`. Without `.env.local` the app runs in local-only mode.

PRs welcome.
