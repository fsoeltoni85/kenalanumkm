# Cloudflare Preview Deployment

## Purpose
## Current preview status

An initial visual-shell preview has already been deployed directly through the authenticated Cloudflare connection (no Cloudflare API token was stored in GitHub):

- Worker: `kenalanumkm-pr-1`
- URL: https://kenalanumkm-pr-1.kenalanumkm-preview.workers.dev
- `/api/health` returned HTTP 200 with `{"status":"ok","app":"kenalanumkm","preview":true}`.
- This is a lightweight static visual shell for UI review. It is not the compiled vinext/Next.js bundle. CI has independently passed the vinext production build.

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
After adding the secret, the workflow can be dispatched against the feature branch from a local GitHub CLI session. The workflow has already been registered by its initial PR run:

```bash
gh workflow run ci.yml --repo fsoeltoni85/kenalanumkm --ref bootstrap/kenalanumkm-foundation -f pr_number=1
```

The same lint, typecheck, tests and build run before deployment. The GitHub web UI's Run workflow button normally appears only when the workflow file is present on the default branch; do not merge this PR just to expose that button.

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
