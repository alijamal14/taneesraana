# Dr. Tanees Raana — clinic website

[taneesraana.mk313.com](https://taneesraana.mk313.com) · consultant gynecologist & obstetrician, Islamabad (G‑14/4) and Nowshera.
Also the landing page for guests on the **Net Gen6** Wi‑Fi (captive portal at wifi.mk313.com, repo `alijamal14/er605w-wifi`).

## Stack

- **Vite 8 + TypeScript**, **Tailwind v4** (`@tailwindcss/vite`), **Motion** for reveals/springs
- Self-hosted **Plus Jakarta Sans** (`public/fonts`, OFL) and inline **Lucide** icons — no CDNs
- Visual language shared with the Wi‑Fi portal: emerald tokens, glass cards, border beam, spotlight, `.mesh` background
- Hosted on **Cloudflare Pages** (project `taneesraana`), deployed with wrangler

Lighthouse (mobile): Performance 99 · Accessibility 100 · SEO 100.

## Develop

```bash
npm install
npm run dev        # http://localhost:5174
npm run build      # typecheck + build to dist/
npm run preview    # serve dist/ on :4174
```

## Deploy

```bash
doppler run --project er605w --config prd -- ./scripts/deploy.sh
```

Builds, deploys `dist/` to the Pages production branch, and attaches `taneesraana.mk313.com`.
DNS: `taneesraana` must be a proxied CNAME to `taneesraana.pages.dev` (the API token cannot edit DNS — change it in
the Cloudflare dashboard). Until then GitHub Pages (`main` branch, legacy) still serves the old site.

## Where things are

| File | What |
|---|---|
| `index.html` | All content, SEO meta, JSON-LD (Physician, 2× MedicalClinic, FAQPage), Google Ads tag |
| `src/app.css` | Tokens (light / dark / `data-theme`), components |
| `src/ui/clinics.ts` | **Clinic hours** (`ISLAMABAD`, `NOWSHERA`) + live open badges in Pakistan time |
| `src/ui/conversions.ts` | Google Ads conversions — `data-conversion="call"` / `"book"` on links |
| `src/ui/chrome.ts` | Theme switch, mobile menu, header, action bar, copy buttons, service-worker toast |
| `public/sw.js` | Network-first pages, cache-first hashed assets (bump `CACHE` to clear) |
| `public/_headers` | Cloudflare cache headers (immutable assets, no-cache HTML/SW) |
| `scripts/deploy.sh` | Cloudflare Pages deploy |

### Changing clinic hours

Update **all three** places, then deploy:
1. `src/ui/clinics.ts` — `ISLAMABAD` / `NOWSHERA` minute ranges (index 0 = Sunday)
2. `index.html` — the `.hours` lists, the two FAQ answers (visible + JSON-LD) and `openingHoursSpecification`
3. The Wi‑Fi portal (`er605w-wifi` repo: `portal/src/ui/clinics.ts` + `portal/index.html`)

Current hours: Islamabad Mon–Thu 6–8 pm, Fri–Sun 8 am–8 pm · Nowshera Mon–Thu 10 am–12 pm.

### Content rules

Keep copy factual (PMDC ethics): credentials, services, locations, hours. No "#1 / best / success-rate" claims,
no ratings or testimonials without a verifiable source and patient consent.

### Conversion tracking

Google Ads `AW-817969533`. Calls → `AW-817969533/IZ5zCIaIuaocEP3yhIYD`, bookings → `AW-817969533/AzWOCIOIuaocEP3yhIYD`.
Add `data-conversion="call"` or `"book"` to any new tel:/booking link. The gtag library loads after the page is idle
(the `gtag()` queue exists from the start, so no events are lost).
