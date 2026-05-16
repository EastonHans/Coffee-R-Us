# Coffee R Us

A single-page application for a specialty coffee shop. Browse the catalog, filter by origin, manage inventory through an admin portal, and view individual product pages, all backed by a local REST API.

---

## Tech Stack

| Layer | Choice |
|---|---|
| UI | React 19 |
| Routing | React Router v7 (data router) |
| State | Context API + custom hooks |
| Styling | Pure CSS (custom design system, no UI library) |
| Mock API | json-server |
| Build | Vite |
| Testing | Vitest + Testing Library |

---

## Features

**Shop**
- Product catalog fetched from a REST API
- Debounced search across name, description, and origin
- Origin filter with multi-select checkboxes
- Responsive grid layout

**Product Page**
- Individual route per product (`/coffee/:id`)
- Inline admin edit form with PATCH support
- Delete product with confirmation

**Admin Portal**
- Add new products via a validated form (POST)
- Client-side validation with accessible error states
- Redirects to shop on success

**Home**
- Store info (name, tagline, phone) loaded from API
- Graceful loading and error states

---

## Architecture

```
src/
├── components/        # Layout, Navbar
├── context/           # StoreContext, StoreProvider, useStore hook
├── hooks/             # useFetchJson, useDebouncedValue
├── lib/               # filterCoffees, parsePrice (pure utility functions)
├── pages/             # Home, Shop, ShopSidebar, ProductList, ProductCard,
│                      # CoffeeProductPage, AdminPortal
└── test-utils/        # renderAppWithDataRouter, mockApiFetch
```

Data fetching lives in `useFetchJson` — a custom hook that handles loading state, error state, abort on unmount, and exposes a `reload` callback for post-mutation refetches. `StoreProvider` composes two instances of it and exposes `addCoffee`, `updateCoffee`, and `deleteCoffee` actions down the tree via context.

---

## API (json-server)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/coffee` | List all products |
| POST | `/coffee` | Add a product |
| PATCH | `/coffee/:id` | Update a product |
| DELETE | `/coffee/:id` | Remove a product |
| GET | `/store_info` | Store metadata |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start both Vite dev server and json-server together
npm run dev:full

# Or run them separately
npm run server   # json-server on :3001
npm run dev      # Vite on :5173
```

---

## Testing

```bash
npm run test:run
```

21 tests across 7 suites covering:

- Unit tests for pure utility functions (`filterCoffees`, `parsePrice`)
- Integration tests for the Shop page (search, debounce, origin filter)
- Integration tests for the Admin Portal (validation, POST, navigation)
- Integration tests for the Product Page (PATCH, DELETE)
- Full routing tests (navbar navigation, dynamic routes, data loading)
- Home page rendering from API data

Tests use a `createFetchMock` utility that simulates the full json-server API in memory, including stateful POST/PATCH/DELETE mutations, so no real network calls are made.

---

## Design

Custom design system built from scratch, no component library. Inspired by high-end editorial coffee branding:

- **Fonts:** Cormorant Garamond (serif headings) + DM Sans (UI text)
- **Palette:** Deep espresso backgrounds, parchment text, gold accents
- **Details:** Animated scroll indicator, card hover effects, gold underline nav transitions, CSS custom properties throughout

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run server` | json-server mock API |
| `npm run dev:full` | Both concurrently |
| `npm run build` | Production build |
| `npm run test:run` | Run test suite once |
| `npm run lint` | ESLint |
