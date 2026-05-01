# Mall of America Cinematic Sales Experience

A browser-based, non-linear sales experience for Mall of America. It is designed for leasing, sponsorship, and event-booking conversations where the first impression needs to feel cinematic, premium, and commercially decisive.

## Setup

```bash
npm install
npm run generate:media
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm run start
```

## Tech Stack

- Next.js App Router
- React
- Tailwind CSS
- Framer Motion
- Three.js
- Local procedural media assets for reliable autoplay and fallbacks
- Vercel-ready project structure

## AI Tools Used

- Codex was used as the product, engineering, and AI-experience design collaborator.
- The visual direction uses AI-authored generative prompts and a local media pipeline to avoid broken remote media.
- Real Mall of America source imagery is kept in `public/media/real`; large raw video source lives in `media_sources` so it is not served publicly.
- Official MOA leasing imagery and the official sponsorship sizzle are used locally after optimization; external embeds are intentionally avoided so playback remains reliable.
- The `scripts/generate_media.py` pipeline creates cinematic poster imagery, module stills, and the autoplay hero video from AI-directed scene prompts.
- The `scripts/generate_real_media.py` pipeline converts real source media into cinematic, responsive experience assets.
- The built-in image-generation tool was not exposed in this environment, so the project ships a reproducible local asset generator plus prompt documentation in `AI_VISUAL_PROMPTS.md`.

## Design Decisions

- Video-first opening: a fullscreen muted looping video with a preloaded poster, fast cinematic loader, and CSS fallback so the first viewport never shows a broken frame.
- Non-linear control: the experience now leads with an interactive command center where a prospect chooses Leasing, Sponsorship, or Events, opens property hotspots, types their brand into a live activation layer, and then jumps into the deeper 3D takeover or commercial modules.
- Emotional hook: the 3D "Place your brand here" takeover lets a sponsor type their own brand, activate crowd/light energy, and picture ownership of the property before the sales ask.
- Expandability: leasing, sponsorship, events, and access modules are separated so deeper venue, category, or campaign paths can be added without rewriting the core experience.
- Performance: heavy interactive scenes are lazy-loaded near viewport entry; media is local and compressed for Vercel deployment.

## Verification

```bash
npm run typecheck
npm run build
npm run qa
```

The QA smoke test checks desktop, tablet, and mobile viewports, confirms the hero video loads, verifies the Three.js canvas is nonblank, captures full-page screenshots, and fails on console errors.

## Source Notes

Core facts are based on public Mall of America sources:

- Mall of America Leasing: 32M+ annual customer visits, $1B+ sales, nearly 500 stores, 45+ eateries, and 30+ Nickelodeon Universe attractions.
- Mall of America About: 32M annual visitors, 300+ events on the about page, and $3B economic impact.
- Mall of America Events: 400+ hosted events every year.
- Mall of America Corporate Partnerships: sponsorship activations, signage, events, and 32M annual guests.
- Mall of America Meetings + Events: private event spaces and capacities.

## Architecture

```text
src/
  app/                  App Router shell and global styling
  components/           Experience UI, motion, cursor, video, 3D map
  data/                 Mall narrative, KPIs, modules, source metadata
  lib/                  Shared helpers
  modules/
    events/             Event-booking expansion module
    leasing/            Leasing expansion module
    sponsorship/        Sponsorship expansion module
scripts/
  generate_media.py     Reproducible local media generator
  qa-smoke.mjs          Browser smoke test and canvas-pixel verification
```

## Deployment

The app is ready for Vercel:

```bash
npm run build
```

The generated media files live under `public/media`, so they deploy with the app and do not depend on third-party video/image URLs.
