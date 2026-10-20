#!/usr/bin/env bash
# Build and deploy taneesraana.mk313.com to Cloudflare Pages.
# Run with Cloudflare credentials from Doppler:
#   doppler run --project er605w --config prd -- ./scripts/deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PROJECT="${PAGES_PROJECT:-taneesraana}"
HOSTNAME="${SITE_HOSTNAME:-taneesraana.mk313.com}"

: "${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN is required}"
: "${CLOUDFLARE_ACCOUNT_ID:?CLOUDFLARE_ACCOUNT_ID is required}"
export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID PROJECT HOSTNAME

npm ci --no-audit --no-fund --silent
npm run build

# Create the Pages project on first run (ignore "already exists").
npx --yes wrangler@4 pages project create "$PROJECT" --production-branch=main >/dev/null 2>&1 || true

# --branch=main publishes to production even when deploying from a feature branch.
npx --yes wrangler@4 pages deploy dist --project-name="$PROJECT" --branch=main --commit-dirty=true

# Attach the custom domain to the Pages project (idempotent).
python3 - <<'PY'
import json, os, urllib.request, urllib.error

token, account = os.environ["CLOUDFLARE_API_TOKEN"], os.environ["CLOUDFLARE_ACCOUNT_ID"]
project, hostname = os.environ["PROJECT"], os.environ["HOSTNAME"]
base = f"https://api.cloudflare.com/client/v4/accounts/{account}/pages/projects/{project}/domains"

def req(method, url, data=None):
    r = urllib.request.Request(url, method=method, data=None if data is None else json.dumps(data).encode(),
                               headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(r) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        return json.loads(e.read() or b"{}")

domains = {d.get("name"): d for d in (req("GET", base).get("result") or [])}
if hostname not in domains:
    created = req("POST", base, {"name": hostname})
    print("attach domain:", created.get("success"), created.get("errors"))
    domains = {d.get("name"): d for d in (req("GET", base).get("result") or [])}
d = domains.get(hostname, {})
print(f"domain {hostname}: status={d.get('status')} verification={((d.get('verification_data') or {}).get('status'))}")
PY

echo "Done. Production: https://$PROJECT.pages.dev — custom domain: https://$HOSTNAME"
echo "If the domain is pending, point DNS: CNAME taneesraana -> $PROJECT.pages.dev (proxied)."
