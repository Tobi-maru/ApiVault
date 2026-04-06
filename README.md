# API Vault

API Vault is a full-stack app for storing API keys, tracking usage against spending limits, and testing a simulated proxy flow behind Clerk authentication.

## Stack

- React 19 + Vite in `web/`
- Express + Prisma in `server/`
- Vercel serverless entry in `api/`
- PostgreSQL via `DATABASE_URL`
- Clerk for auth

## Layout

```text
├── api/                    # Vercel function entrypoints
├── prisma/                 # Prisma schema and migrations
├── server/                 # Express app, routes, and Prisma client
│   ├── app.ts              # Shared app for local server + Vercel
│   ├── db.ts               # Prisma client singleton
│   ├── index.ts            # Local dev server entrypoint
│   ├── lib/                # Request parsing and validation helpers
│   └── routes/             # API routes
├── web/                    # Vite frontend workspace
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── lib/            # Frontend API helpers
│   │   └── types/          # Shared frontend types
│   └── vite.config.ts      # Builds static output into /public
└── package.json            # Root scripts and workspace config
```

## Environment

Root `.env`:

```env
PORT=3001
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_test_...
CORS_ORIGIN=http://localhost:5173
```

`web/.env.local`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

For Vercel, add the same variables in the project settings. `VITE_CLERK_PUBLISHABLE_KEY` must be exposed to the frontend build. `CORS_ORIGIN` is optional on Vercel if the web app and API are served from the same domain.

## Install

```bash
bun install
```

The repo uses a Bun workspace, so the root install covers both the server and the frontend.

## Database

Local development expects PostgreSQL, not SQLite.

Common commands:

```bash
bunx prisma migrate dev
bunx prisma generate
```

Production migrations are intentionally separate from the build:

```bash
bun run migrate:deploy
```

## Development

```bash
bun run dev
```

- Web: `http://localhost:5173`
- API: `http://localhost:3001`

## Build

```bash
bun run build
```

This produces:

- `dist/` for the Node server build
- `public/` for the Vercel-served frontend bundle

## Vercel

The repo is structured for a single Vercel project:

- static frontend assets are built into `public/`
- API requests are rewritten to `api/index.ts`
- SPA routes rewrite to `/index.html`

Recommended Vercel environment variables:

- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY`
- `CORS_ORIGIN` if you serve the frontend from a separate origin

## Notes

- API key create/update payloads are now validated server-side.
- `usageLimit=0` is treated as a real limit instead of being silently ignored.
- Database migration is no longer coupled to the build step.
