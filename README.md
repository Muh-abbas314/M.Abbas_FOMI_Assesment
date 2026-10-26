# Fomi — Frontend Assessment

## What this is

One Next.js app for the Fomi Frontend Developer take-home:

- `/create` — Part A: the mockup built as a responsive, working image and video generation page.
- `/studio` — Part B: "Director's Board", a redesigned Video Generation Workspace.

Both talk to one stateless mock API at `/api/generations`.

## Run it

Requires Node 24 (`.nvmrc`).

```bash
nvm use
npm install
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm test` | Unit and component tests (Vitest) |
| `npm run e2e` | End-to-end tests (Playwright) |

## Structure

_Filled in as the app grows._

## Decisions

See [DECISIONS.md](DECISIONS.md).

## Credits

See [CREDITS.md](CREDITS.md).
