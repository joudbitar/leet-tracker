# Contributing

PRs welcome. Bug fixes, new problems, pacing tweaks, whatever.

## Run it locally

```bash
git clone https://github.com/joudbitar/leet-tracker.git
cd leet-tracker
npm install
npm run dev
```

The app runs without any backend in local-only mode. To test auth and sync, set up Firebase (see the README) and add your config to `.env.local`.

## Before you open a PR

- `npx tsc --noEmit` passes with no errors.
- Keep the Hacker News look: dense rows, small text, no heavy components or new UI libraries.
- One change per PR. Small and focused merges fast.

## Good first things to work on

- New problem lists (Blind 75 variants, company-specific sets).
- Better pacing logic for tight timelines.
- Accessibility passes on the row and grid.

Open an issue first if it is a big change, so we can agree on the shape before you build it.
