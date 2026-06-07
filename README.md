# BADWRX — Badger Rifleworks

Custom hunting rifle showcase site — black/white/red theme, build gallery, step-by-step configurator, and quote-only contact flow (no checkout).

## Preview locally

**Node.js is required.** If `npm` isn't found, install from [nodejs.org](https://nodejs.org) (LTS), then:

```bash
cd /Users/ejd/Documents/GitHub/BADWRX
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** A portable Node runtime may exist in `.node/` for bootstrapping. Use `npm run dev:local-node` if system Node isn't installed yet.

**Connection refused?** The dev server isn't running — run `npm run dev` in a terminal and keep it open while you browse.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, featured builds, process |
| `/builds` | Full build gallery |
| `/builds/[slug]` | Individual rifle detail + specs |
| `/configure` | Multi-step rifle configurator + quote form |
| `/about` | Builder story |
| `/contact` | Consultation form |

## Project structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── configurator/       # Build wizard
│   ├── contact/            # Contact form
│   ├── layout/             # Header, Footer
│   └── rifles/             # Cards, spec tables
├── data/
│   ├── rifles.ts           # Placeholder build data (→ Sanity later)
│   └── configurator-options.ts
├── lib/
│   └── types.ts            # Shared TypeScript types
└── sanity/                 # Future Sanity CMS integration
    └── README.md
```

## Theme

- **Black** `#0a0a0a` — backgrounds
- **White** `#fafafa` — text
- **Red** `#e11d2e` — accents (CTAs, labels, selection states)

## Placeholder content

Build specs and copy are modeled after real custom rifle builders (Hill Country Rifles, G.A. Precision, etc.). Photos are from [Unsplash](https://unsplash.com) — replace with client photography in `src/data/rifles.ts` or via Sanity.

## Next steps

1. Replace placeholder images with client photos
2. Wire Sanity CMS for admin editing (`src/sanity/`)
3. Connect quote/contact forms to email (Resend, Formspree)
4. Deploy to Vercel

## Deploy

```bash
npm run build
```

Push to GitHub and connect to [Vercel](https://vercel.com) for automatic deploys.
