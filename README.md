# English Rule Book

A production-ready, offline-first grammar reference app for SSC · Railway · Banking · Defence · State PCS aspirants.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **TailwindCSS** — custom `paper/ink/amber` design tokens
- **Zustand** — catalog + user-data stores
- **Dexie (IndexedDB)** — offline-first storage; the entire app works without a network
- **React Router v6** — clean URL structure
- **Supabase** — wired up via env vars when you're ready to add auth + sync

## Local development

```bash
npm install
npm run dev
```

## Deployment (Vercel)

1. Push this folder to a GitHub repo
2. Import into Vercel → framework preset **Vite**
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as env vars (optional — app works offline without them)

## Project structure

```
src/
  features/english/
    components/   — RuleCard, CategoryCard, Badges, Quiz
    data/         — seedData.ts  (replace/extend with real content)
    pages/        — Dashboard, Category, Rule, Search, Bookmarks
    services/     — db.ts (Dexie), ruleRepository.ts
    store/        — catalogStore, userDataStore (Zustand)
    types/        — rule.types.ts (single source of truth)
  shared/
    components/   — AppLayout, Sidebar, TopBar, EmptyState, Skeleton
    hooks/        — useDebouncedValue
    utils/        — cn
  routes/
    router.tsx
```

## Adding content

Open `src/features/english/data/seedData.ts` and add to the `categories`, `chapters`, and `rules` arrays.
The DB auto-seeds on first load.
For bulk import, the Admin Panel (Phase 2) will provide a CSV/JSON upload UI.

## Phase roadmap

| Phase | Status  | What's included |
|-------|---------|-----------------|
| 1     | ✅ Done | Data model · DB · Dashboard · Category · Rule page · Search · Bookmarks · Dark mode · Quiz |
| 2     | Planned | Admin panel · Bulk import · Rich editor · Progress charts |
| 3     | Planned | Supabase auth · Cloud sync · Web Push notifications |
| 4     | Planned | Gamification · Streaks · Leaderboard |
