## Search → Bus Routes (V1: 2 screens)

V1 redesign splits the flow into:
1) a dedicated destination input screen with recommended destinations, and
2) a route results screen that supports left/right swipe between alternatives and shows the selected route on a map with bus-stop dots + next-bus countdown.

### Goals
- Make the first screen “just search” (fast to use, low cognitive load).
- Make route browsing feel like browsing alternatives (horizontal swipe).
- Show the route on a map with clear bus stop dots (tap for details).
- Show next-bus countdown for relevant stop/service without overwhelming the UI.

### Non-Goals (V1)
- Full turn-by-turn navigation.
- Fare calculation and ticket purchase.
- Real-time vehicle tracking along the whole route (beyond next-bus ETA).

---

## Screen 1: Destination Search

### Layout
- **Top**: Title `Where to?`
- **Primary control**: destination input (Google Places autocomplete).
- **Below**: “Recommended” destinations list/grid.
- **Optional**: “Use current location” indicator (not an input; just a reassurance).

### Recommended Destinations (below input)
Pick any mix depending on what you have available:
- **Recent**: last 5 searches (local storage).
- **Favorites**: saved places (home/work).
- **Popular**: curated list (e.g., “Changi Airport”, “Orchard”, “Bugis”).
- Each item: name + small subtitle (area) + optional icon.

### Interactions
- Typing shows autocomplete results.
- Tap a recommended destination fills the input and triggers search.
- Selecting a destination navigates to Screen 2 (results), passing `destinationPlaceId`.

### States
- **Idle**: show recommended destinations immediately.
- **No permission**: still allow destination selection; results screen will handle location error.

### Text Wireframe
```
┌─────────────────────────────────────────┐
│ Where to?                               │
│ [ Search destination…              🔍 ]  │
│                                         │
│ Recommended                             │
│  • Home (if set)                        │
│  • Work (if set)                        │
│  • Recent: Punggol Stn                  │
│  • Popular: Changi Airport              │
└─────────────────────────────────────────┘
```

---

## Screen 2: Route Results (Swipe + Map)

### Navigation
- **Top-left**: Back button (native header back) to return to Screen 1.
- Title can be blank or destination name (if available from Places details).

### Core Interaction: Swipe between route options
- Horizontal swipe (left/right) switches the active route option.
- A small **pager indicator** shows: `● ○ ○` (or “1/3”).
- Switching routes updates:
  - map polylines
  - stop dots
  - summary + next-bus panel

Implementation options (already in deps):
- `react-native-pager-view` for swipe pages
- or `react-native-tab-view` (used in Nearby) with tabs hidden and swipe enabled

### Layout (recommended)
- **Top 60%**: Map (react-native-maps)
  - polylines for steps (bus vs walk colors)
  - bus-stop dots (markers)
- **Bottom 40%**: “Transit Line Strip” (compact bottom card)
  - route as a single line with key nodes (start/boarding/ride/destination)
  - one primary “next” row (ETA + platform/bay when available)
  - primary CTA: `START NAV`

### Text Wireframe (Screen 2)
```
┌────────────────────────────────────────────────────┐
│  ←  Destination Name (optional)                    │
├────────────────────────────────────────────────────┤
│  MAP (swipe left/right changes option)             │
│                                                    │
│   ● Start                                           │
│    ╲╲╲╲╲  (walk dashed)                              │
│      ● Stop A (boarding)   [ETA 3 min]             │
│      ─────────────── (bus solid) ─────────────     │
│      ● Stop B (transfer)                            │
│      ╲╲╲╲╲  (walk dashed)                              │
│      ● Destination                                  │
│                                                    │
│              (Pager)        ●  ○  ○                │
├────────────────────────────────────────────────────┤
│  “Transit Line Strip” (below map)                  │
│  (focus: route as a line, super compact)           │
│                                                    │
│  ┌────────────────────────────────────┐            │
│  │  🚶 20m        🚌 858 (2)        📍 │            │
│  │  ────────●──────────●──────────●   │            │
│  │          Stop        Ride       PTB3│           │
│  └────────────────────────────────────┘            │
│                                                    │
│  ┌────────────────────────────────────┐            │
│  │  Next: 2m      Platform: Aft Punggol│           │
│  └────────────────────────────────────┘            │
│                                                    │
│  ┌────────────────────────────────────┐            │
│  │          [ START NAV ]              │            │
│  └────────────────────────────────────┘            │
└────────────────────────────────────────────────────┘
```

### Map Visual Rules
- **Bus segments**: solid polyline (e.g., green/blue)
- **Walking segments**: dashed polyline (e.g., red, dashed)
- **Bus stop dots**:
  - small filled circles for intermediate stops
  - emphasized start/end/transfer stops (larger or outlined)
- Tapping a stop dot opens a small callout with:
  - stop name/code
  - “Next bus: X min” for the relevant service (see “Next (ETA) row” section)

### Transit Line Strip (bottom card)
For the active route option (single, compact line):
- Left-to-right: walk → board stop → ride segment(s) → destination node.
- Show key labels only (e.g., boarding stop name, service number, destination/POI short code).
- Keep the visual strip tappable: tapping a node highlights the corresponding stop dot on the map.

### Next (ETA) row
V1 recommendation to keep it useful + cheap:
- Show **one primary countdown**: next bus for the route’s first upcoming transit segment (the first `travelMode === "transit"` step).
- If user taps a stop dot / node, fetch and show ETA for that stop/service.

Also show platform/bay when the backend provides it (otherwise omit).

### Primary CTA
`START NAV` starts navigation mode (V1 can be “lightweight” — e.g., keep map centered + show the same strip and ETA updates).

---

## Data + API Mapping (fits current codebase)

### Route alternatives
- Route fetch remains: `GET routesUrl` with `{ origin: "lat,lng", destination: "place_id:<id>" }`
- UI treats each backend `Route` as one swipeable “option”.
- Within an option, legs/steps are flattened to “connect transit” visually.

### Bus stop dots (need stop codes + coordinates)
Current route steps contain stop names + step locations, but stop dots should ideally use real bus stop codes + lat/lng.
Use `GET busRoutesByStopNameUrl` with:
- `departureStop`, `arrivalStop`, `serviceNo`
This returns `BusRouteVO[]` with `busStopCode` and `busStopVO.latitude/longitude` (usable for markers).

### Next bus countdown
Use `GET busServiceUrl` (already used by `NearbyBusItem` / `TwoPointsWithCurve`) with:
- `busStopCode`
- `busCode` (service number)
Response includes `nextBus.countDown` (seconds) → render as “Arr / X min”.

---

## States (Screen 2)
- **Loading**: map shows a lightweight skeleton overlay; bottom sheet shows 2–3 skeleton rows.
- **Empty**: “No routes found” + `Try again` + `Change destination`.
- **Error (network)**: banner + retry.
- **Error (location permission denied)**: explanation + CTA to enable location.

---

## Interaction Details (V1)
- Swipe left/right changes route option.
- Tap stop dot:
  - highlights it
  - opens callout
  - triggers ETA fetch for that stop/service (debounced).
- Back button returns to Screen 1 without losing the typed destination (optional: keep input state).

---

## Open Questions
- Do backend `Route.legs` represent multiple legs per alternative, or do you intend to merge them into one connected itinerary for display?
- Do we want ETAs for all stops on the map (expensive), or only for boarding stop + selected stop (recommended for V1)?
