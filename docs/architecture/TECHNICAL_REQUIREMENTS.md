# Technical Requirements

## Approved stack

- Next.js API surface powered by Cloudflare vinext on Vite.
- TypeScript strict mode, React, Tailwind CSS, shadcn/ui conventions and Lucide icons.
- Supabase: PostgreSQL 17, Auth, Storage and Edge Functions.
- Cloudflare Workers hosting.
- GitHub repository and GitHub Actions CI/CD.
- Moota API v2 is a candidate integration only, not enabled.

The public leaderboard UI does not require a map renderer or browser geolocation. Physical address/coordinates remain listing attributes for future verification and operational use, not a public map surface.

## Architecture

Browser uses public/publishable credentials only. Server routes/actions validate identity and authorization. RLS is mandatory for exposed tables. Database is source of truth for listings, geography, confirmed stake and rank. Sensitive operations (claim approval, payment reconciliation, ledger posting) are server-side, validated and idempotent. Provider integrations are behind adapters.

The leaderboard read model must produce at most one champion per Kabupaten/Kota for a category and period. National and province boards rank those champions by confirmed stake. City scope returns exactly one city champion. Click counts must never be included in ranking order.

## Cloudflare / vinext

Use the official create-vinext-app or vinext init --platform=cloudflare setup path. The current project is wired using vinext's Cloudflare Vite plugin and cf project config. Run dependency install, compatibility checks and a production build in CI. Workers is the target runtime. Keep preview and production environments isolated.

## GitHub Actions

Preview deployment is documented in the Cloudflare PR preview runbook. It uses an isolated Worker per PR; production Worker and production secrets are not touched by preview workflows.

Checks: install dependencies, lint, typecheck, unit tests, production build. Preview deploy only after checks pass. Production deploy only from main and only after explicit approval. Use protected GitHub environments and least-privilege secrets. Never expose secrets in logs or NEXT_PUBLIC variables.

## Supabase

All DDL is versioned in supabase/migrations. RLS on all exposed tables. Policies must reflect ownership and public/private fields. Prefer SECURITY INVOKER; any SECURITY DEFINER needs documented reason, fixed search_path, narrow grants and security review. Never expose secret/service-role key to browser. Money stored as integer minor units, not float.

## Security and privacy

Validate server-side; rate-limit write endpoints and click tracking; redact logs; deduplicate provider events; authenticate webhooks using provider secrets/signatures (IP allowlist is only defense-in-depth); preview must not access production data or process real payments. Collect minimum personal data. Do not request device geolocation for the public leaderboard.

## Performance / UX

Paginate leaderboards; avoid N+1; cache only public non-user-specific responses. Provide keyboard navigation, visible focus, accessible labels and reduced-motion support.

## Environment variable names

NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; server-only SUPABASE_SECRET_KEY only if required; CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID. Values belong in encrypted secrets, never Git.
