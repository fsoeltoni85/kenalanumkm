# Technical Requirements

## Approved stack
- Next.js API surface powered by Cloudflare **vinext** on Vite.
- TypeScript strict mode, React, Tailwind CSS, shadcn/ui conventions, Lucide icons.
- MapLibre GL JS; licensed map style/tile provider to be selected before live map launch.
- Supabase: PostgreSQL 17 + PostGIS, Auth, Storage, Edge Functions.
- Cloudflare Workers hosting.
- GitHub repository and GitHub Actions CI/CD.
- Moota API v2 is a candidate integration only, not enabled.

## Architecture
Browser uses public/publishable credentials only. Server routes/actions validate identity and authorization. RLS is mandatory for exposed tables. Database is source of truth for listings, geography, confirmed stake and rank. Sensitive operations (claim approval, payment reconciliation, ledger posting) are server-side, validated and idempotent. Provider integrations are behind adapters.

## Cloudflare / vinext
Use official `create-vinext-app` or `vinext init --platform=cloudflare` setup path when a shell/runtime is available; do not hand-invent generated Cloudflare configuration. vinext is evolving: run compatibility checks and production builds before relying on newer Next.js APIs. Workers is target runtime. Keep preview and production environments isolated.

## GitHub Actions
Checks: install dependencies, lint, typecheck, unit tests, production build, migration checks. Preview deploy only after checks pass. Production deploy only from main and only after explicit approval. Use protected GitHub environments and least-privilege secrets. Never expose secrets in logs or NEXT_PUBLIC variables.

## Supabase
All DDL is versioned in `supabase/migrations`. RLS on all exposed tables. Policies must reflect ownership and public/private fields. Prefer SECURITY INVOKER; any SECURITY DEFINER needs documented reason, fixed search_path, narrow grants and security review. Never expose secret/service-role key to browser. Use PostGIS points and spatial indexes; money stored as integer minor units, not float.

## Security and privacy
Validate server-side; rate-limit write endpoints and click tracking; redact logs; deduplicate provider events; authenticate webhooks using provider secrets/signatures (IP allowlist is only defense-in-depth); preview must not access production data or process real payments. Collect minimum personal data.

## Performance / UX
Paginate leaderboards; avoid N+1; use viewport-bounded map queries and clustering; cache only public non-user-specific responses. Provide map list alternative, keyboard navigation, visible focus, accessible labels and reduced-motion support.

## Environment variable names
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; server-only `SUPABASE_SECRET_KEY` only if required; `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Values belong in encrypted secrets, never Git.
