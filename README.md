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
├── api/                        # Vercel function entrypoints
├── packages/
│   └── shared/                 # Shared types between frontend and backend
│       └── src/
│           └── types/
│               └── api-key.ts
├── prisma/                     # Prisma schema and migrations
├── server/                     # Express app with layered architecture
│   ├── app.ts                  # Shared app for local server + Vercel
│   ├── index.ts                # Local dev server entrypoint
│   ├── config/                 # Environment configuration
│   ├── controllers/            # HTTP request handlers
│   ├── middleware/             # Express middleware (error handling, etc.)
│   ├── routes/                 # API route definitions
│   ├── services/               # Business logic layer
│   ├── types/                  # Server-specific types
│   ├── utils/                  # Utilities (Prisma client, etc.)
│   └── validators/             # Input validation
└── web/                        # Vite frontend workspace
    ├── src/
    │   ├── components/
    │   │   └── ui/             # Shared UI components
    │   ├── features/
    │   │   └── keys/           # Feature-specific components and hooks
    │   ├── lib/                # Frontend API helpers
    │   ├── types/              # Frontend type re-exports
    │   ├── utils/              # Frontend utilities
    │   ├── App.tsx
    │   └── main.tsx
    └── vite.config.ts          # Builds static output into /public
```

## Environment

Root `.env`:

```env
PORT=3001
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
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

The repo uses a Bun workspace, so the root install covers the server, frontend, and shared packages.

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

- API key create/update payloads are validated server-side.
- `usageLimit=0` is treated as a real limit instead of being silently ignored.
- Database migration is no longer coupled to the build step.
- The server uses a layered architecture with separate controllers, services, and validators.
- Shared types live in `packages/shared` and are consumed by both frontend and backend.
