# Fomi — Frontend Assessment

One Next.js app for the Fomi Frontend Developer take-home:

| Route | What |
|---|---|
| `/create` | **Part A**: the mockup, built as a responsive and working image *and* video generation page |
| `/studio` | **Part B**: "Director's Board", a redesigned Video Generation Workspace (in progress) |
| `/api/generations` | A stateless mock job API shared by both parts |

## Run it

You need Node 24 (pinned in `.nvmrc`).

```bash
nvm use
npm install
npm run dev
```

Then open http://localhost:3000. It redirects to `/create`.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm test` | Unit and component tests (Vitest + Testing Library) |
| `npm run e2e` | Browser tests (Playwright): flows, responsive overflow at 320–2560px, axe accessibility scans |

## Things to try on `/create`

- **Generate.** Type a prompt and press **⌘/Ctrl + Enter**. A row appears at once and shows the real stage and % until the results fade in.
- **Video.** Switch to **Video** (composer switch or top tab). Video tiles preview on hover or focus, or on tap on phones. Only clips near the screen load.
- **Failure and retry.** Include the word **"fail"** in a prompt. It fails at 60% on the first attempt, and **Retry** succeeds.
- **Honest cancel.** Press **Cancel** while it runs. It says "Cancelling…" until the server confirms. If the job finished first, it says so.
- **Reload mid-generation.** Running jobs resume with the correct progress.
- **History.** Click a thumbnail to jump to and highlight its row. **History · view all** and **Gallery** open the viewer, which supports ←/→, Esc, Download and Use as reference.
- **Prompt actions.** Each prompt card has **Reuse prompt** and **Copy prompt**.
- **`/create?fresh=1`** shows the first-run empty state with example prompts (nothing saved in this mode).
- **`/create?mode=video`** opens straight into video mode.
- **Support** (top right) lists the keyboard shortcuts.
- **Seed** under Advanced: the same seed and prompt give the same results.

`MOCK_JOB_SPEED=4 npm run dev` speeds the mock clock up (the e2e tests use 4).

## How the mock API works

`POST /api/generations` returns a job id that *is* the job: start time, type, result count, aspect ratio and seed, packed as base64url JSON. `GET /api/generations/:id` works out progress from the clock on every request. No server memory is shared, so it behaves the same on any Vercel instance and survives reloads. See [DECISIONS.md](DECISIONS.md).

## Structure

```
app/                     routes only (pages, API route handlers, global CSS tokens)
components/ui/           shared primitives: Button, IconButton, Tooltip, Segmented, Select, Accordion, Sheet, ProgressBar, Skeleton
components/JobWatcher    invisible poller, one per running job
features/create/         Part A: workspace, composer (rail + dock), feed, viewer, state (reducer + provider)
lib/                     job engine + validation (mock), API client, hooks, storage, formatting, shared option lists
data/                    seed feed and media catalogue (JSON)
public/media/            licensed Pexels photos, clips and posters
e2e/                     Playwright specs
test/                    test helpers and fixtures
```

## Quality checks

Lighthouse on a production build (`/create`):

| | Performance | Accessibility | Best practices | LCP | CLS |
|---|---|---|---|---|---|
| Desktop | 98 | 100 | 100 | 1.0 s | 0 |
| Mobile (simulated slow 4G) | 93 | 100 | 100 | 3.2 s | 0 |

Plus axe scans at 1280px and 375px with no serious or critical issues, and no horizontal scroll at any width from 320px to 2560px.

## Decisions

Every product and engineering choice, with why and what it cost, is in [DECISIONS.md](DECISIONS.md).

## Credits

Photos and clips are from Pexels. See [CREDITS.md](CREDITS.md).
