# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint (zero warnings policy)

# Docker
npm run docker:build   # docker build -t flight-tracker .
npm run docker:run     # docker run -p 8080:80 --env-file .env flight-tracker
```

No test suite is configured.

## Environment

Requires a `.env` file with:
```
VITE_AVIATION_STACK_KEY=<your_key>
```
Free API key from aviationstack.com. Without it, the app shows a setup error with instructions.

## Architecture

**Stack:** React 19, Vite 7, Tailwind CSS 3 — no TypeScript.

**Data flow:**
1. `SearchBar` calls `onSearch` → `App.handleSearch()`
2. `flightService.searchFlight(flightNumber)` hits AviationStack API (`http://api.aviationstack.com/v1/flights?flight_iata=...`)
3. Raw response is transformed: status strings mapped to human-readable labels, times extracted with priority `actual > estimated > scheduled`
4. `FlightTicket` receives the flight object and renders the boarding pass UI

**State management:** React Context only. `LanguageContext` (`src/i18n/`) manages `en`/`de` language state, persisted to `localStorage` as `flighttracker-lang`, and provides a `t()` function for translations. App-level state (`flight`, `loading`, `error`, `hasSearched`) lives in `AppContent`.

**Component roles:**
- `FlightTicket` — boarding pass UI; contains flight progress bar logic, tear-off stub animation, and barcode click trigger
- `FlappyPlane` — Canvas-based Flappy Bird easter egg, revealed by clicking the barcode in `FlightTicket`
- `LanguageSwitcher` — fixed-position EN/DE toggle (top-right), glassmorphism style

**Translations:** All UI strings in `src/i18n/translations.js` as `{ en: {...}, de: {...} }`. Dynamic strings use a function pattern, e.g. `flightNotFound: (num) => \`...\``.

**Styling:** Tailwind utility classes throughout; no CSS Modules. Boarding pass uses hardcoded cream background (`#f4f1ea`) via inline style. Responsive breakpoints use `md:` prefix; tear-off stub is hidden on mobile.

**Deployment:** Multi-stage Docker build (Node 18 Alpine → Nginx Alpine). Custom `nginx.conf` handles SPA routing (404 → index.html).
