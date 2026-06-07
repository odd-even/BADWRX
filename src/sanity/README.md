# Sanity CMS

BADWRX uses [Sanity](https://www.sanity.io) so you can edit site content in a browser — no code required.

## What you can edit in `/studio`

| Content type | What it controls |
|---|---|
| **Rifle Build** | Title, specs, descriptions, photos, featured flag |
| **University Course** | Class title, price, topics, description |
| **Site Settings** | Brand copy, home page sections, testimonial, trust bar, about page |

## One-time setup

### 1. Create a Sanity project

1. Go to [sanity.io/manage](https://www.sanity.io/manage) and create a project (free tier is fine)
2. Note your **Project ID** and create a **Dataset** named `production`

### 2. Add environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_editor_token
```

Get an **Editor** API token at:  
Sanity Manage → your project → **API** → **Tokens** → Add token

### 3. Seed the database with current content

```bash
npm run seed:sanity
```

This uploads rifle photos and creates all builds, courses, and site settings from the existing site copy.

### 4. Start the site and open the studio

```bash
npm run dev
```

- **Website:** [http://localhost:3000](http://localhost:3000)
- **Content Studio:** [http://localhost:3000/studio](http://localhost:3000/studio)

## How it works

- Pages fetch content from Sanity when env vars are configured
- If Sanity is not configured, the site falls back to `src/data/*.ts` files automatically
- After editing in the studio, click **Publish** — changes appear on the site (may need a refresh; production uses Sanity CDN)

## Deploying

Add the same three env vars to your hosting provider (e.g. Vercel).  
Deploy the studio at `/studio` or run a separate Sanity-hosted studio — both work with this setup.

## Still in code (not CMS yet)

- Configurator options (`src/data/configurator-options.ts`)
- Page layout and styling
- Logo and theme colors

These can be moved into Sanity later if needed.
