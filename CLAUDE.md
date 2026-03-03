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
2. `flightService.searchFlight(flightNumber)` hits AviationStack API (`http://api.aviationstack.com/v1/flights?flight_iata=...`). Fallback logic carefully ignores 6-character ICAO24 hex strings for aircraft IATA codes.
3. Raw response is transformed: status strings mapped to human-readable labels, aircraft names looked up from `src/data/aircrafts.js`, times extracted with priority `actual > estimated > scheduled`
4. `FlightTicket` receives the flight object and renders the boarding pass UI. It also extracts the airline logo color and passes it back up to `App` as `brandColor`, which dynamically styles the SearchBar and App Header.
5. After successful search, `badgeService.checkBadges()` evaluates the flight against badge criteria and triggers toast notifications for newly earned badges.

**State management:** React Context only. `LanguageContext` (`src/i18n/`) manages `en`/`de` language state, persisted to `localStorage` as `flighttracker-lang`, and provides a `t()` function for translations. App-level state (`flight`, `loading`, `error`, `hasSearched`, `badges`, `newBadge`, `showTrophyCase`) lives in `AppContent`.

**Component roles:**
- `FlightTicket` — boarding pass UI; contains flight progress bar logic (based on true UTC times), tear-off stub animation, and barcode click trigger. Generates pseudo-random but persistent class and seat data based on flight number and date.
- `FlightMapContainer` — Wrapper with 2D/3D toggle switch, renders either `FlightMap` or lazy-loaded `GlobeMap`.
- `FlightMap` — Interactive Leaflet route map from departure to destination with curved path. Handles antimeridian crossing for routes like SYD→LAX.
- `GlobeMap` — 3D globe.gl globe with animated flight arc, airport markers/labels, auto-rotation. Lazy-loaded via `React.lazy()` to avoid bundling Three.js on initial load. Handles antimeridian midpoint calculation for correct initial camera position.
- `TimezonePanel` — Live synchronized clocks for local origin and destination time. Jetlag severity, sleep tips, day/night timeline.
- `FlightInfo` — Sub-bar showing airline logo, flight number, and mapped aircraft model.
- `BadgeNotification` — Toast popup (fixed bottom-right) for newly earned achievement badges. Auto-dismisses after 4s.
- `BadgeTrophyCase` — Modal showing all 4 badges in a 2x2 grid, earned ones in color, unearned grayed with lock icon.
- `FlappyPlane` — Canvas-based Flappy Bird easter egg, revealed by clicking the barcode in `FlightTicket`
- `LanguageSwitcher` — fixed-position EN/DE toggle (top-right), glassmorphism style

**Services:**
- `flightService.js` — API calls and data transformation from AviationStack.
- `badgeService.js` — Badge detection logic (`checkBadges`) and localStorage persistence (`flighttracker-badges`). Uses shared time utilities.

**Shared utilities:**
- `src/utils/timeUtils.js` — Timezone offset calculation (`getTzOffsetMinutes`), flight duration (`getFlightDuration`), best time extraction (`getBestTime`), local hour extraction (`getLocalHour`). Used by both `TimezonePanel` and `badgeService`.

**Achievement Badges:** 4 badges stored in `localStorage` as `flighttracker-badges`:
- Long Haul Survivor (flight > 12h)
- Night Owl (departure 00:00-05:00)
- Globe Trotter (timezone diff > 6h)
- Red Eye (night departure + early morning arrival)

**Boarding Pass Download:** `App.jsx` wraps `FlightTicket` in a ref div and uses `html2canvas` (scale 3, bg `#f7f3ec`) to export as PNG. Download button is fixed-position below the language switcher, visible only when a flight is loaded.

**Translations:** All UI strings in `src/i18n/translations.js` as `{ en: {...}, de: {...} }`. Dynamic strings use a function pattern, e.g. `flightNotFound: (num) => \`...\``.

**Styling:** Tailwind utility classes throughout; no CSS Modules. Ticket UI uses `.ticket-paper` class for texture and shading. Responsive breakpoints use `md:` prefix; tear-off stub is hidden on mobile, and relies on precise shadow/spacing CSS to look attached/detached. App background features animated mesh gradients and grain overlay in `index.css`. Custom animations defined in `tailwind.config.js` include `fade-in`, `fade-in-up`, `slide-up`, `pulse-soft`, and `badge-pop`.

**Deployment:** Multi-stage Docker build (Node 18 Alpine → Nginx Alpine). Custom `nginx.conf` handles SPA routing (404 → index.html).

**localStorage keys:**
- `flighttracker-flight` — cached flight data (10 min TTL, versioned)
- `flighttracker-recent` — array of up to 5 recent flight numbers
- `flighttracker-lang` — language preference (`en`/`de`)
- `flighttracker-theme` — theme preference (`light`/`dark`)
- `flighttracker-badges` — array of earned badge objects `[{ id, flightNumber, earnedAt }]`
