# Gibe

Gibe is an AI-first browser game forge built on the Next.js 16.2 app router. The home arcade, studio, dashboard, and public `/play/[slug]` routes live in the same workspace so you can describe a game in natural language, watch the AI refine and generate HTML/CSS/JavaScript, inspect a sandboxed preview, fix runtime faults, and publish a sharable Arcade link without leaving your browser.

## Features
- Prompt refinement, generation, and repair driven by the `ai` package, a Vercel AI Gateway API key, and a model such as `meituan/longcat-flash-chat`.
- Studio shell that keeps prompt text, AI summaries, Monaco-backed HTML/CSS/JS editors, runtime traces, and share links synchronized while you generate, fix, save, and publish.
- Better Auth powered sign-in, dashboard, and private drafts so every creator sees their own builds with live counts for total, public, and private games.
- Public arcade built from `listPublicGames` plus `/play/[slug]` play routes that expose published builds with metadata, share buttons, and `GameCard` previews.

## Getting started
### Prerequisites
1. Node.js 20 or newer with npm/yarn/pnpm.
2. PostgreSQL or Neon (configured via `DATABASE_URL`) for Better Auth and the `Game` schema.
3. Vercel AI Gateway API key (`AI_GATEWAY_API_KEY`) and optional model override (`AI_GAME_MODEL`).
4. Better Auth secret (`BETTER_AUTH_SECRET`) and the app’s public base URL (`BETTER_AUTH_URL`).
5. Optional Google OAuth credentials (`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`) to show the Google button on `/sign-in`.

### Setup
1. Copy `.env.example` to `.env.local` and fill the values above.
2. Run `npm install`.
3. Run `npm run prisma:generate`.
4. Run `npm run db:push`.
5. Run `npm run dev` and open <http://localhost:3000>.

## Environment variables
| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection for Better Auth, sessions, and the `Game` model. |
| `BETTER_AUTH_SECRET` | 32+ character secret for Better Auth cookies. |
| `BETTER_AUTH_URL` | Public base URL of the app (defaults to `http://localhost:3000`). |
| `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` | Optional credentials to show the Google sign-in experience. |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway key that `/api/ai/generate` and `/api/ai/fix` consume. |
| `AI_GAME_MODEL` | Model identifier passed to the AI gateway (default `meituan/longcat-flash-chat`). |

## How it works
Sign in via `/sign-in`, which authenticates through Better Auth (and Google if secrets are provided). The dashboard (`/dashboard`) uses `listGamesForUser` to show total/public/private counts and renders every draft with `<GameCard>`. Press “Create new game” to land at `/studio/new` or reopen a draft, and keep prompt text, titles, descriptions, and code bundles in sync inside `StudioShell`. The shell calls `/api/ai/generate` to refine the prompt and build a fresh game, `/api/ai/fix` to repair runtime faults, `/api/games` (POST) to save drafts, and `/api/games/[gameId]` (PATCH) to publish updates. Public builds automatically appear on the home arcade via `listPublicGames` and are playable at `/play/[slug]`.

## Architecture
- App Router pages under `app/` combine server components (`app/page.tsx`, `app/dashboard/page.tsx`, `app/sign-in/page.tsx`) with session-aware helpers (`lib/session.ts`).
- `components/game-studio/studio-shell.tsx` orchestrates prompt/on-screen editing, `GamePreview`, runtime message logging, share-link copying, and calls to the AI and persistence APIs.
- `lib/ai.ts` wraps `generateObject` with schemas for prompt refinement, game generation, and repair; `lib/games.ts` exposes `createGame`/`updateGame` plus helpers to fetch public or owned builds.
- `lib/auth.ts` wires Better Auth with Prisma to keep sessions, accounts, and tokens in the PostgreSQL database described by `prisma/schema.prisma`. The `Game` model stores HTML/CSS/JS bundles, prompt text, slug, `isPublic`, and timestamps while Prisma’s client lives in `lib/generated/prisma`.
- `/api/ai/generate`, `/api/ai/fix`, `/api/games`, and `/api/games/[gameId]` validate requests with Zod, call the libraries above, and call `revalidatePath` so `/`, `/dashboard`, `/studio/[id]`, and `/play/[slug]` stay up to date after saves or publishes.

## Scripts
- `npm run dev` – start the Next.js dev server.
- `npm run build` – compile for production.
- `npm run start` – run the production server after `build`.
- `npm run lint` – run ESLint.
- `npm run prisma:generate` – refresh the generated Prisma client.
- `npm run db:push` – sync Prisma schema changes to the database.

## Deployment notes
Deploy anywhere that supports Next.js 16.2 (Vercel recommended). Make sure the environment variables above are configured on the hosting platform, keep `BETTER_AUTH_URL` consistent with your public domain, and rerun Prisma generation/push whenever `prisma/schema.prisma` changes. The AI routes expect `AI_GATEWAY_API_KEY`, so provide a valid key and model identifier in production, and keep the PostgreSQL connection stable for both Better Auth and the `Game` data.
