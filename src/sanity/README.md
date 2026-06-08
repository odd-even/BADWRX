# Sanity CMS

BADWRX uses [Sanity](https://www.sanity.io) so you can edit site content in a browser — no code required.

## Studio URL

- **Local:** http://localhost:3000/studio
- **Production:** https://badwrx.vercel.app/studio

Log in with the Sanity account that has access to project **imo49u00**.

## What your client can edit

| Section | Controls |
|--------|----------|
| **Site Settings** | Brand info, home hero phrases, platforms copy, pillars, ballistic section, testimonials, about page, contact blurb |
| **Rifle Builds** | Title, specs, photos, descriptions, featured flag |
| **University Courses** | Full course page — tagline, price, curriculum, outcomes, hero image |
| **Merch** | Caps, tees, sweaters — title, price, sizes, colors, product photo |
| **Build Configurator** | Platforms (via Rifle Builds), calibers, finishes/colors, optics, rings, Basecamp & Ballistic packages, pricing |
| **Build Requests** | Read-only inbox of configurator submissions |

**Still in code (not CMS):** contact form layout, merch page shipping blurb, configurator placeholder images until uploaded in Studio.

## One-time setup

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage)
2. Copy `.env.example` → `.env.local` and fill in project ID, dataset, and an **Editor** API token
3. Run `npm run seed:sanity` to load current site content
4. Invite your client at **Manage → Members** with the **Editor** role

## Deploying

Add these env vars to Vercel (Production):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
```

After editing in the studio, click **Publish** — changes appear on the live site after the next page load (CDN cache may take a minute).
