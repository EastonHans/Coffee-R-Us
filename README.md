# STRYD

A single-page application for a performance sneaker brand. Browse the catalog, filter by category and price, manage inventory through an admin portal, and view individual product pages — backed by a local REST API in development and static JSON on deploy.

---

## Tech Stack

| Layer | Choice |
|---|---|
| UI | React 19 |
| Routing | React Router v7 (data router) |
| State | Context API + custom hooks |
| Styling | Pure CSS (custom design system, no UI library) |
| Mock API | json-server (dev) / static JSON + Vercel rewrites (prod) |
| Build | Vite |
| Testing | Vitest + Testing Library |

---

## Features

**Home**
- Store info (name, tagline, phone) loaded from `/store_info`
- Full-viewport hero with animated display typography
- Scrolling marquee ticker and animated stat counters
- Brand story, feature pillars, and scroll-reveal sections
- Graceful loading and error states throughout

**Shop**
- Product catalog fetched from `/sneakers`
- Debounced search across name, description, category, and tag
- Category filter chips (Running, Lifestyle, Court, Trail)
- Max-price range slider
- Responsive product grid with images, category badges, and hover interactions

**Product Page** (`/sneakers/:id`)
- Individual route per sneaker
- Inline admin edit form with PATCH support
- Delete product with confirmation dialog

**Admin Portal** (`/admin`)
- Add new styles via a validated form (POST)
- Client-side validation with accessible error states
- Redirects to shop on success

---

## Architecture

```
src/
├── components/        # Shared layout: Navbar, Cursor, Reveal wrapper
├── context/           # StoreContext, StoreProvider, useStore hook
├── hooks/             # useFetchJson, useDebouncedValue
├── lib/               # filterSneakers, parsePrice (pure utility functions)
├── pages/             # Home, Shop, ShopSidebar, ProductList, ProductCard,
│                      # SneakerProductPage, AdminPortal
└── test-utils/        # renderAppWithDataRouter, createFetchMock
```

`useFetchJson` handles loading state, error state, abort on unmount, and exposes a `reload` callback for post-mutation refetches.

`StoreProvider` composes two `useFetchJson` instances (catalog + store info) and exposes `addProduct`, `updateProduct`, and `deleteProduct` actions via context. Mutations update local state optimistically so the UI stays functional on static hosts where API writes are unavailable.

---

## API

**Development** — json-server on port 3001, proxied by Vite:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/sneakers` | List all products |
| POST | `/sneakers` | Add a product |
| PATCH | `/sneakers/:id` | Update a product |
| DELETE | `/sneakers/:id` | Remove a product |
| GET | `/store_info` | Store metadata |

**Production** — `/sneakers` and `/store_info` are rewritten by Vercel to `public/sneakers.json` and `public/store_info.json`.

Product shape:

```json
{
  "id": "1",
  "name": "Runner X1",
  "description": "Carbon plate + StrydFoam™ stack.",
  "origin": "Running",
  "price": 129,
  "tag": "Best Seller",
  "img": "https://..."
}
```

> `origin` is the category field (Running, Lifestyle, Court, Trail). The field name is carried over from the initial data model.

---

## Getting Started

```bash
npm install

# Start Vite dev server and json-server together
npm run dev:full

# Or run them separately
npm run server   # json-server on :3001
npm run dev      # Vite on :5173
```

Open the app at [http://localhost:5173](http://localhost:5173). Requests to `/sneakers` and `/store_info` are proxied to json-server automatically.

---

## Testing

```bash
npm run test:run
```

21 tests across 7 suites:

| Suite | Coverage |
|---|---|
| `filterSneakers` | Pure filter logic |
| `parsePrice` | Price parsing edge cases |
| Shop | Catalog load, debounced search, category filter |
| Admin Portal | Validation, POST, redirect on success |
| Product Page | Detail view, PATCH, DELETE |
| Routing | Navbar, `/sneakers/:id`, API-driven home |
| Home | Store info rendering from API |

Tests use `createFetchMock` — an in-memory implementation of the full json-server API including stateful POST/PATCH/DELETE — so no real network calls are made.

---

## Design

Custom design system built from scratch, no component library. Sport/editorial aesthetic inspired by performance brands and kinetic web design:

- **Fonts:** Anton (display headings), Barlow Condensed (labels/UI), DM Sans (body)
- **Palette:** Near-black backgrounds (`#060606`), off-white text, lime green accents (`#d4f53c`)
- **Details:** Custom cursor with lerp-smoothed ring, scrolling marquee, scroll-reveal animations, animated stat counters, card hover states, CSS custom properties throughout `index.css`

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run server` | json-server mock API |
| `npm run dev:full` | Both concurrently |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run test` | Vitest in watch mode |
| `npm run test:run` | Run test suite once |
| `npm run lint` | ESLint |