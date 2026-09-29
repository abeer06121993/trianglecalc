# TriangleCalc deployment checklist

Target: https://trianglecalc.com

## 1. GitHub

Create a new GitHub repository, for example `trianglecalc`.
Upload the contents of this project (not `node_modules`).

## 2. Cloudflare Pages

Use Cloudflare Pages and connect the GitHub repository.

Build settings:
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: use a current LTS version supported by Cloudflare

The project is a static Vite/React application, so no server runtime is required for the calculator.

## 3. Custom domain

In Cloudflare Pages, add:
- `trianglecalc.com`
- optionally `www.trianglecalc.com`

Choose one canonical hostname and redirect the other to it. The project currently uses `https://trianglecalc.com/` as the canonical URL.

## 4. Before launch

Replace the placeholders in `/privacy`, `/imprint` and `/contact` with the real operator information and the exact services used for hosting, analytics and advertising.

Do not activate advertising until the privacy/consent setup is complete.

## 5. Google Search Console

Add `https://trianglecalc.com/` as a Domain or URL-prefix property.
Submit:
`https://trianglecalc.com/sitemap.xml`

## 6. Advertising

The project contains reserved ad slots but no ad network script yet. After the site is live and the advertising account is approved, add the provider's official script and ad units.

For Google AdSense traffic from the EEA, UK and Switzerland, use the required Google-certified consent management setup before serving personalized advertising.

## 7. Final checks

- HTTPS works
- `https://trianglecalc.com/robots.txt` loads
- `https://trianglecalc.com/sitemap.xml` loads
- canonical URL is correct
- calculator works on mobile and desktop
- legal pages contain real operator data
- no placeholder domain remains
- no `example.com` remains in the production source
