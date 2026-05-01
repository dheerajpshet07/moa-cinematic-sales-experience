# Round Two Write-Up

## Live URL

https://moa-cinematic-sales-experience.vercel.app

## GitHub

https://github.com/dheerajpshet07/moa-cinematic-sales-experience

## What Changed

This version has been reshaped from a polished scrolling experience into a non-linear interactive sales tool. The viewer now enters a command center immediately after the cinematic hero and chooses one of three commercial paths:

- Leasing
- Sponsorship
- Events

Each path changes the media, commercial framing, hotspots, proof points, and activation layer. The viewer can explore zones, type a brand name, trigger a takeover state, and jump into deeper 3D or module views without being forced through a slide-like order.

The supporting proof now runs as one Scale -> Energy -> Ownership arc, rather than separate informational sections. The viewer first sees the audience, then feels the property in motion, then imagines brand ownership.

## Why It Is Not Presentation-Shaped

The experience is organized around buyer intent instead of sequence. A tenant, sponsor, or event partner can enter the property through the business case that matters to them, then move across hotspots, modules, source-backed proof, and the 3D takeover in any order.

The scroll story remains available as supporting narrative, but it is no longer the core interaction model. The command center is the primary interface.

## "I Need To Be Here" Moment

The strongest emotional moment is the brand takeover simulation. A prospect can type their own brand into the live activation layer and see the property respond with media, lighting, crowd energy, and a staged commercial context.

That matters because it changes the sales conversation from abstract inventory into ownership. The viewer is not only reading about foot traffic; they are picturing their brand inside the destination.

## Media And AI Usage

The experience uses optimized real Mall of America imagery and motion wherever available. AI is used as the creative direction layer for generative atmosphere, cinematic treatment, interaction design, prompt language, and fallback visual systems where official assets do not fully cover the sales story.

For round two, a generated activation concept layer was added. It uses real MOA media as the base, then creates new cinematic concept stills and motion through generative light architecture, crowd-path overlays, media-surface simulation, and AI-authored prompt treatment. This gives the prospect a future-state view of what a partnership could become, without relying on generic stock filler.

All production media is local under `public/media`, so the live experience does not depend on fragile external embeds.

## Technical Notes

- Next.js App Router
- Tailwind CSS
- Framer Motion
- Three.js
- Local optimized video and image assets
- Responsive QA across desktop, tablet, and mobile
- Vercel-ready build
