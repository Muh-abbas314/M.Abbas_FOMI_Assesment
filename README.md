# Fomi — Frontend Assessment

My submission for the Fomi Frontend Developer take-home. It's one Next.js app with two parts:

| Page | What it is |
|---|---|
| `/create` | **Part A**: the Fomi mockup, built as a real, responsive page where image *and* video generation work |
| `/studio` | **Part B**: "Director's Board", my redesign of the Video Generation Workspace |

Opening `/` takes you to `/create`. The folder icon in the top bar opens the studio.

**Live demo:** https://mabbasfomi.vercel.app — [/create](https://mabbasfomi.vercel.app/create) (Part A) · [/studio](https://mabbasfomi.vercel.app/studio) (Part B)

**Source code:** https://github.com/Muh-abbas314/M.Abbas_FOMI_Assesment

---

## Run it locally

You need Node 24 (the version is pinned in `.nvmrc`).

```bash
nvm use
npm install
npm run dev
```

Then open http://localhost:3000.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the app for development |
| `npm run build` then `npm start` | Production build |
| `npm run lint` | Checks code style |

---

## Part A — `/create`

The mockup, built as closely as I could, and made to actually work.

### Things to try

- **Generate.** Type a prompt and press **⌘/Ctrl + Enter**. A new row appears straight away and shows the real step and % until the results fade in.
- **Video.** Switch to **Video** in the composer or the top bar. Video results play a preview when you hover over them (or tap, on a phone). Only clips that are on screen load.
- **Failure and retry.** Put the word **"fail"** in a prompt. It fails partway, and **Retry** works.
- **Cancel.** Press **Cancel** while a job runs. It says "Cancelling…" and only says "Cancelled" once the server agrees. If the job finished first, it tells you.
- **Reload mid-job.** Running jobs carry on with the right progress.
- **History.** Click a thumbnail to jump to that generation. **History · view all** and **Gallery** open a full-screen viewer: ←/→ to browse, Esc to close, plus Download and **Use as reference**.
- **Prompt cards** have **Reuse prompt** and **Copy prompt**.
- **First visit:** `/create?fresh=1` shows the empty state with example prompts.
- **Support** (top right) lists the keyboard shortcuts.

### Small changes from the mockup (and why)

- The Generate button turns a deeper orange once you type. White text on the mockup's light peach is too hard to read, so the peach is used for the "not ready yet" state.
- The small unlabelled toggle next to the avatar is left out, because nothing explains what it does.
- The avatar shows initials instead of a stranger's photo.
- "Advance" is spelled "Advanced", and the placeholder grammar is fixed.
- The **Edit** tab is shown but disabled, with a "Coming soon" tooltip.

---

## Part B — `/studio`: Director's Board

### Why I picked the video workspace

I work on a video / AI content generation app, so video is the area I know best. I took inspiration from what I've seen there: people don't want to type one prompt and hope. They want to **direct**:
- build a film shot by shot;
- keep every version they liked;
- see the whole thing quickly;
- always know what's running and what it costs.

### The idea

AI will soon make a good *single clip* easily. The hard part becomes making many shots work together as one film. So in this workspace you don't prompt a video. You **direct** one.

### What you can do

- **The board.** Your project is a row of shots. Each card is as wide as its shot is long, so you can see the pacing at a glance. Select a shot to edit its prompt, length, camera move and transition. Reorder shots with **Alt + ←/→** or the Move buttons.
- **Takes, not overwrites.** "Generate take" adds a new version to the shot and never replaces the one you chose. Pick your keeper with a click or keys **1–4**. **Compare takes** plays two versions side by side with one shared scrubber.
- **Play the board.** Switch the stage to **Board** and press Play. Every chosen take plays back to back, right away, like a rough cut. Shots without a take show as a striped placeholder, so you see the gaps.
- **Honest render queue.**
  - Drafts are cheap and fast; the final render costs more. You see the price before you commit.
  - The final render waits until every shot has a take, and tells you which ones are missing.
  - The queue shows each job's real step and time left, and you can keep working while it runs.
  - Stopping a render asks first and refunds the credits.
- **Keyboard first.** Space plays or pauses, ←/→ moves between shots, J/K/L shuttle, ⌘/Ctrl + Enter generates a take, and **?** shows all the shortcuts.
- **On a phone** the studio becomes a review screen: watch takes, pick keepers, check the queue. Editing shots is left to bigger screens on purpose. On a tablet, "Edit shot" opens the editor in a sheet.
- Your project is **saved in the browser**, so it opens where you left it.

### Left out on purpose

- Frame-accurate timeline editing.
- Audio and music.
- Working with other people.
- Real AI, sign-in and uploads.

The brief rewards knowing what not to build. These would add a lot of surface without helping the core idea.

---

## How the fake backend works

There is no database. When you start a job, the server packs what it needs (job type, start time, settings) into the **job id itself**. Every progress check works out how far along the job is from the clock. That means it gives the same answer on any Vercel server, and a page reload never loses a running job.

Results come from a small set of licensed stock photos and clips. The words in your prompt pick the closest match, so results feel related to what you typed.

---

## Tech

- Next.js 16 (App Router), React 19, JavaScript.
- Tailwind CSS plus CSS Modules (for keyframes and masks).
- No animation library: CSS transitions only. Motion is turned off for people who ask for reduced motion.

### Folders

```
app/              pages and the mock API routes
components/ui/    shared building blocks (buttons, selects, sheets, dialogs…)
features/create/  Part A
features/studio/  Part B
lib/              mock job engine, API client, hooks, helpers
data/             seed data (JSON)
public/media/     licensed photos and clips
```

### Quality checks for `/create` (production build)

| | Performance | Accessibility | Best practices | Layout shift |
|---|---|---|---|---|
| Desktop | 98 | 100 | 100 | 0 |
| Mobile | 93 | 100 | 100 | 0 |

There is no sideways scrolling at any width from 320px to 2560px.

---

## Credits

All photos and videos are from [Pexels](https://www.pexels.com) under the Pexels License. Each file's photographer and source page are listed in `data/media.json`.
