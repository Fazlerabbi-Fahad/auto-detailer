# Mobile detailing demo template

One Next.js site that personalizes itself from the URL. Send each prospect a link with their business name and city, and the page, the browser tab, and the Instagram/iMessage link preview all show their business. No build per prospect.

Next.js 15 (App Router, JavaScript), Tailwind CSS v4, GSAP + ScrollTrigger, Lenis, react-hook-form.

```bash
npm install
npm run dev        # http://localhost:3001
```

## 1. Make a personalized link

Add query params to the home page:

```
/?name=Elite+Auto+Spa&city=Dallas
/?name=Elite+Auto+Spa&city=Dallas&state=TX&phone=2145550142&ig=eliteautospa&accent=E11D48
```

| Param    | What it does                                    | Rules                                                                        |
| -------- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| `name`   | Business name everywhere (kept exactly as typed) | Max 60 chars. Letters, numbers, spaces and `& ' . - ,` only                   |
| `city`   | City everywhere (auto title-cased)              | Same as name                                                                  |
| `state`  | Shown as "Dallas, TX"                            | Must be a real 2-letter US state code                                         |
| `phone`  | Call/text links (hidden if missing)             | 10 digits, formatted as (214) 555-0142                                        |
| `ig`     | Instagram link (hidden if missing)              | Handle without `@`                                                            |
| `accent` | Brand color for buttons, prices, active states  | 6-digit hex without `#`. Button text flips black/white automatically for contrast |

Anything invalid quietly falls back to the defaults. Values containing `<` or `>` are rejected outright.

**Easiest way:** open `/builder`. Type the details, and it shows the encoded URL (an `&` in a name becomes `%26`), a Copy button, an Open button, and the exact link-preview image the prospect will see.

The link preview image is generated at `/og?name=...&city=...` (1200x630).

## 2. Add a short `/p/` link

Short links like `/p/elite-auto-spa` read from `src/data/prospects.js`:

```js
const prospects = {
  "elite-auto-spa": { name: "Elite Auto Spa", city: "Dallas", state: "TX", phone: "2145550142", ig: "eliteautospa", accent: "E11D48" },
};
```

`/builder` prints the exact line to paste. Commit and redeploy. An unknown slug shows the default demo, not a 404.

## 3. Batch-generate links from a CSV

Put your leads in `leads.csv` (a sample is included):

```
name,city,state,phone,ig,accent
Elite Auto Spa,dallas,TX,214-555-0142,@eliteautospa,#E11D48
```

Then run:

```bash
BASE_URL=https://your-demo.vercel.app npm run links
```

On Windows PowerShell: `$env:BASE_URL="https://your-demo.vercel.app"; npm run links`.

This writes `links.csv` with a cleaned row, a `slug`, the full `url`, and a `short_url` for every lead. It also prints `prospects.js` entries you can paste if you want the short links to work. Phone formats like `(214) 555-0142`, a leading `@`, and a leading `#` are all handled. Custom paths: `npm run links -- in.csv out.csv`.

## 4. Change prices and defaults

Everything lives in `src/brand.config.js`:

- `defaults`: the fallback name ("Glossline Mobile Detailing"), city ("your city"), and accent (`7FD3FF`).
- `packages`: name, duration, what's included, and prices per vehicle size (`sedan`, `suv`, `truck`). The current numbers are **sample** prices.
- `addOns`: name and price for each chip.
- `serviceAreas`: optional list of nearby towns. If it's empty, only the prospect's city is shown.
- `formEndpoint`: a Formspree-compatible URL (e.g. `https://formspree.io/f/abcdwxyz`). While it's empty, bookings are logged to the browser console.
- `motion.respectReducedMotion`: `"off"` (default: always full motion), `"soften"` (for visitors who prefer reduced motion: shorter fades, no parallax, no smooth scroll, no movement over 24px), or `"strict"` (no animation for those visitors).

Photos are all in one map, `src/lib/images.js`. Replace the files in `public/images/` (or change the paths) and keep the keys.

## 5. When a client buys

In `src/brand.config.js`:

```js
conceptBanner: false,   // removes the "Concept site made for ..." top bar
showPhotoNotes: false,  // removes every "Your photos go here" pill
```

Then:

- Swap in their photos in `public/images/`.
- Replace the sample reviews in `src/components/Reviews.js` with their real Google reviews, and delete the "Sample review" label at the same time.
- Set their real prices and `formEndpoint`.
- If the site should appear on Google, remove the `robots` entries in `src/app/layout.js` and `src/lib/meta.js`, the `X-Robots-Tag` header in `next.config.mjs`, and change `src/app/robots.js` to allow crawling. **Leave all of these in place for demo deployments.** They keep Google from indexing pages that carry real businesses' names.

## 6. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel, choose **Add New → Project**, import the repo, and keep the default Next.js settings.
3. Deploy. Your links are `https://<project>.vercel.app/?name=...`.
4. Optional: add a custom domain under **Settings → Domains**, then use it as `BASE_URL` when you run `npm run links`.

No environment variables are needed.

## What's in the demo

Concept bar → nav → hero (the name auto-fits, so names up to 40+ characters never overflow at 360px) → packages with a Sedan/SUV/Truck toggle → add-ons → draggable before/after → "We come to you" steps (pinned on desktop) → gallery strip → sample reviews → service area + FAQ → 3-step booking form with a running total → footer with the name fitted edge to edge. A sticky mobile "Book now" bar appears after the hero.

Honesty guards: the concept bar, the "Your photos go here" pills, the "Sample review" labels, `noindex, nofollow` on every page (meta tag plus `X-Robots-Tag` header), and a `robots.txt` that disallows everything.

## Photo credits and notes

All photos are royalty-free from [Unsplash](https://unsplash.com/license) and live in `public/images/`.

**The before/after pairs are not true pairs.** I couldn't find free matching before/after shots, so each slider uses two separate but matching photos:

- Interior: mud-stained fabric seats (before) vs. a clean leather interior (after), from different cars.
- Paint: a mud-caked SUV (before) vs. a glossy, beaded black hood (after), from different cars.

Replace them with the client's real before/after photos as soon as you have them.

## Checked

- Test names: `A&J Mobile Detailing`, `Señor Shine`, `The Very Long Name Premium Mobile Auto Detailing Co`, no params, and `?name=<script>alert(1)</script>&accent=zzz` (falls back to the defaults; no markup is rendered).
- 360, 390, 768, and 1440px wide with no horizontal scroll, with and without `prefers-reduced-motion: reduce`, under all three motion settings.
- Lighthouse mobile on a production build (localhost): Performance 91, Accessibility 100, Best Practices 100. SEO scores low on purpose because of `noindex`.
