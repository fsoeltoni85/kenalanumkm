# Cloudflare Preview Deployment

## Purpose
PR previews run as isolated Cloudflare Workers and never replace the production Worker. The account workers.dev subdomain configured for this project is:

`kenalanumkm-preview.workers.dev`

For PR number N, the expected preview URL is:

`https://kenalanumkm-pr-N.kenalanumkm-preview.workers.dev`

The workflow only posts this link after `/api/health` returns HTTP success.

## GitHub environment setup
Create a GitHub Actions environment named `preview` in repository Settings → Environments. Add one secret:

- `CLOUDFLARE_API_TOKEN`: create a scoped Cloudflare API token using the official **Edit Cloudflare Workers** template, limited to the KenalanUMKM account. Do not paste it into this repository, a workflow file, or a chat message.

The account ID is configured in `cloudflare.config.ts` and the workflow; it is an identifier, not a secret.

The token is used only by the PR preview deployment and cleanup jobs. When it is absent, CI still runs, but the preview step writes a skip notice and does not deploy.

## Start a preview manually
After adding the secret, open the repository Actions tab → **CI and Cloudflare Preview** → **Run workflow**. Select branch `bootstrap/kenalanumkm-foundation`, keep PR number `1`, and run. This manual trigger is included because connector-created commits may not automatically start new Actions runs. The same checks still run before deployment.

## Workflow behavior
1. GitHub Actions installs dependencies and runs lint, typecheck, tests and production build.
2. Only after all checks pass, a same-repository PR deploys to a dedicated Worker named `kenalanumkm-pr-N`.
3. The workflow polls `/api/health`. It posts/updates a PR comment only after the health check succeeds.
4. Closing the PR deletes that dedicated preview Worker.
5. Production Worker name `kenalanumkm` is not used by this PR preview job.

## Data and cost safeguards
- No production Supabase credentials are configured by this workflow.
- No payment provider or real payment flow is enabled in preview.
- No paid Cloudflare product add-on is provisioned by this workflow. Worker requests and resource quotas remain subject to the account's current plan limits.
- Do not add a custom domain or deploy to production as part of PR preview.

## Troubleshooting
- If preview is skipped, check that `CLOUDFLARE_API_TOKEN` exists in the GitHub `preview` environment.
- If deployment succeeds but health polling fails, inspect the GitHub Actions deploy and health-check logs before sharing the URL.
- If the account workers.dev domain changes, update the expected hostname in this workflow and this runbook.
