# SEPAKA

Premium unisex leather jackets — marketing site and storefront (private repository).

## Tech stack

| Layer | Notes |
| --- | --- |
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, design tokens in `tailwind.config.ts` + `src/styles/tokens.css` |
| **Motion** | Framer Motion |
| **Commerce** | Stripe (integration planned; not yet in dependencies) |
| **Hosting / analytics** | Vercel, `@vercel/analytics` |

Supporting libraries include `lucide-react`, `clsx`, and `tailwind-merge`.

## Run locally

```bash
git clone <repository-url>
cd sepaka-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production build: `npm run build` then `npm run start`.

## Folder structure (`src/`)

```
src/
├── app/                 # App Router — root layout, globals, home page; route groups (marketing) / (shop) reserved
├── components/
│   ├── layout/          # Navbar and shared chrome
│   ├── sections/        # Page sections (e.g. Hero)
│   ├── product/         # Product UI (reserved)
│   └── ui/              # Shared primitives (reserved)
├── content/
│   └── products/        # Product JSON
├── styles/              # CSS tokens imported by `globals.css`
├── types/               # Shared TypeScript types (e.g. product model)
├── hooks/               # Client hooks (reserved)
└── lib/                 # Utilities (reserved)
```

Static assets: `public/` (e.g. brand images, hero video).

## Build status

| Phase | Status |
| --- | --- |
| **Foundation** | **Complete** — Tailwind tokens, typography (Bodoni Moda + Inter), root `layout`, global styles, Navbar |
| **Homepage** | **In progress** — Full-bleed video hero, Bottega-inspired nav, placeholder sections below the fold for scroll testing; photography and real sections to follow |
| **Shop & product** | **Not started** — Route group `(shop)`, product grid, PDPs, cart |
| **Stripe / checkout** | **Planned** |
| **Journal / story pages** | **Planned** |

## Environment variables

**Current build:** none required (no `process.env` usage in the codebase yet).

**Planned for Stripe (keys only — do not commit values):**

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

Add others (e.g. `NEXT_PUBLIC_SITE_URL`) when checkout and webhooks are implemented.
