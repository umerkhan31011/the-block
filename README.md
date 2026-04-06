# The Block — Buyer Auction Platform

A buyer-side vehicle auction prototype built for the OPENLANE coding challenge.

## How to Run

**Requirements:** Node.js 18+ and npm 9+

```bash
npm install
npm run dev        # opens at http://localhost:5173
```

```bash
npm run build      # production build
npm run preview    # preview production build
```

## Time Spent

~5 hours — planning + data exploration, scaffolding, data layer (types/hooks/context), components, pages, wiring + polish.

## Assumptions and Scope

**Included:** inventory browse, search, multi-facet filters, sort, vehicle detail with all spec fields, bid flow with validation, buy now, watchlist, vehicle comparison, live countdown, currency toggle, unit tests, responsive design, `localStorage` persistence.

**Skipped:** authentication, seller workflows, checkout/payments, backend API, database. A frontend-only prototype is appropriate for the timebox and the challenge explicitly permits it.

**Simplified:** auction timestamps are normalised to today's date (hour only) so the app always shows a realistic mix of Live / Upcoming / Ended auctions regardless of when you open it.

## Stack

- **Frontend:** React 19 + TypeScript
- **Build:** Vite 8
- **Styling:** Tailwind CSS 4
- **Routing:** React Router 7
- **Testing:** Vitest + Testing Library

## What I Built

A fully responsive buyer-side auction interface with:

- **Inventory browse** — 200 vehicles in a paginated grid (20/page)
- **Search** — full-text match across make, model, year, trim, VIN, lot, city
- **Filters** — make, body style, fuel type, transmission, title status, year range, price range; all as chip toggles with "clear all"
- **Sort** — price low/high, year newest/oldest, mileage
- **Vehicle detail page** — image gallery with thumbnails, full specs, condition grade + damage notes, title status badge, dealership info
- **Currency toggle** — switch all prices between CAD and USD via a header toggle; managed globally through `CurrencyContext`
- **Bid flow** — validated bid form (must exceed current high bid by min $100), accepts any whole-dollar amount, bid history, "You're the highest bidder" banner, reserve met/not met indicator
- **Buy Now flow** — confirmation modal for vehicles with a `buy_now_price`; purchase recorded to `localStorage`, bid form hidden after purchase
- **Watchlist** — save/unsave vehicles via heart icon on cards and detail page; persisted to `localStorage`; dedicated `/watchlist` page with counter badge in the header
- **Comparison view** — select 2–3 vehicles with checkboxes, sticky bottom bar shows selections, full side-by-side spec table at `/compare` with differing values highlighted
- **Live auction countdown** — real-time hh mm ss ticker on the detail page for "Live" auctions with a pulsing green indicator
- **Auction status** — Live / Upcoming / Ended badges (auction hours normalised to today for a realistic spread)
- **Persistence** — all bids and purchases stored in `localStorage` and survive page refresh
- **Mobile-responsive** — fluid grid, slide-out filter drawer on mobile

## Notable Decisions

**Frontend-only:** Static JSON + `localStorage` for bids gives a complete buyer experience with zero infrastructure — appropriate for a prototype.

**React Context over Zustand:** For a single slice of state (bids), `useReducer` + Context avoids an extra dependency and is straightforward to trace.

**Pagination over infinite scroll:** 20 per page keeps the grid snappy and scannable without rendering all 200 cards at once.

**Auction timestamp normalisation:** The dataset has synthetic future dates. Each vehicle's auction hour is normalised to *today* so Live/Upcoming/Ended spread is realistic immediately — the app works the same on any date.

**Reserve price display:** "Reserve not met / met" gives buyers meaningful signal without revealing the actual figure — mirrors real auction UX.

**CAD currency + km:** All prices default to CAD with odometer in km — matching the Canadian market the data represents. A toggle switches to USD.

## Testing

```bash
npm test              # single run
npm run test:watch    # watch mode
```

39 unit tests across 3 suites:

- **`filterVehicles`** (20 tests) — search, make, body style, fuel type, transmission, title status, year range, price range, combined filters
- **`sortVehicles`** (7 tests) — all 5 sort options, effective price logic, immutability
- **`bidReducer`** (12 tests) — PLACE_BID, BUY_NOW, multi-vehicle isolation, timestamps, immutability

## What I'd Do With More Time

- **Real-time updates** — WebSocket or SSE so all connected buyers see bid changes instantly
- **Backend + DB** — REST API in front of PostgreSQL for shared state, server-side validation, rate limiting
- **Auth** — user accounts with per-user bid history
- **E2E tests** — Playwright flows for bidding, buy now, comparison
- **Accessibility audit** — ARIA roles, keyboard navigation end-to-end
- **Image CDN** — responsive `srcset` instead of placeholder URLs
