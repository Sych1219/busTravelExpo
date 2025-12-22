## Search → Bus Routes (Results List)

Designs the “BusRoutes” results list shown on the Search flow after a user selects a destination (Google Places `place_id`).

### Goals
- Show scannable route options after destination selection.
- Use current location automatically (no manual origin input).
- Present each option as a compact step strip (walk/bus/walk…) + total duration.
- Enable drill-in to a detailed view showing walking segments and stop-by-stop info.

### Non-Goals
- Turn-by-turn navigation.
- Live ETAs in the results list.
- Rich comparison (fares, accessibility, transfer count) beyond basic steps.

### Entry Points
- `src/components/search/SearchView.tsx`: user selects destination via `GooglePlacesAutocomplete`, which sets `placeId`.
- `src/components/search/BusRoutes.tsx`: rendered as `<BusRoutes destinationPlaceId={placeId} />`.
- `src/screens/SearchScreen.tsx`: stack routes include `SearchView`, `RouteView`, and `ListWalkAndStopsView`.

### User Flow
1. User opens `SearchView`.
2. User searches and selects a place; `placeId` is set from `data.place_id`.
3. `BusRoutes` reads device location (`useLocation`) and fetches candidate routes from backend.
4. `BusRoutes` renders a list of itineraries (currently represented as `Leg[]`).
5. User taps an itinerary row → navigates to `ListWalkAndStopsView`, passing the selected `leg` as route params.

### Data Model (current TypeScript interfaces)
Defined in `src/components/search/BusRoutes.tsx`:
- `Route { legs: Leg[] }`
- `Leg { distance, duration, startAddress, startLocation, endAddress, endLocation, steps }`
- `Step { distance, duration, departureStop, arrivalStop, numStops, busCode, travelMode, polyline, ... }`
- `TextValue { text, value }`, `LatLng { lat, lng }`, `Polyline { points }`

Assumption: backend returns `Route[]` matching these shapes.

### Backend API Contract
**Endpoint**
- `GET ${baseUrl}/busRoute/getRoutes` (`routesUrl` in `src/utils/UrlsUtil.tsx`)

**Query params**
- `origin`: string `"lat,lng"` from `useLocation()` (`location.latitude`, `location.longitude`)
- `destination`: string `"place_id:<destinationPlaceId>"`

**Response**
- `Route[]`, with `route.legs[].steps[]` including `travelMode` (e.g. `"walking"`, `"transit"`) and `polyline.points`.

### Component Responsibilities
**`BusRoutes` (`src/components/search/BusRoutes.tsx`)**
- Triggers fetch when `location` and `destinationPlaceId` are available and change.
- Transforms `Route[]` into a flat `Leg[]` list for rendering.
- Renders each `leg` as a tappable row that navigates to detail.

**`StepItem` (`src/components/search/StepItem.tsx`)**
- Renders each `Step` as an icon segment:
  - walking icon for `travelMode === "walking"`
  - bus icon + service number pill for `travelMode === "transit"`
- Adds arrow separators between steps.
- For long lists (`>= 5`), replaces one middle item with `...` (current behavior).

**`ListWalkAndStopsView` (`src/components/search/ListWalkAndStopsView.tsx`)**
- Splits a `leg` into walk segments and transit segments.
- For each transit segment, fetches stop-route data from backend:
  - `GET ${baseUrl}/busStop/getBusRoutesByStopName` (`busRoutesByStopNameUrl` in `src/utils/UrlsUtil.tsx`)
  - Params: `departureStop`, `arrivalStop`, `serviceNo`

### UI Structure
Each itinerary row shows:
- Step sequence (walking/bus segments) rendered by `StepItem` with arrows.
- Total duration (`leg.duration.text`) aligned to the right.
- Divider between rows.

Wireframe (text)
```
SearchView
┌─────────────────────────────────────────┐
│ Destination search (Google Places)      │
├─────────────────────────────────────────┤
│ BusRoutes                               │
│  [🚌 11 → 🚌 12 → …]             15 mins │  (tap)
│  ─────────────────────────────────────  │
│  [🚶 → 🚌 22 → 🚌 221]          15 mins │  (tap)
│  ─────────────────────────────────────  │
└─────────────────────────────────────────┘
```

### State & Error Handling (recommended spec; current code is partial)
**Loading**
- Desired: show a loading placeholder while fetching.
- Current: `legs` initializes to `mockLegs`, so “loading” state rarely appears.

**Empty**
- If API returns no routes/legs, show “No routes found” + retry.

**Permission denied**
- If `useLocation()` fails with `Permission denied`, show an explanatory message and a retry or settings path.

**Network/API error**
- Show an inline error state with retry; avoid only `console.log`.

### Performance Considerations
- Fetch only when both location and destination are valid (already done).
- Consider cancel/ignore stale requests if destination changes rapidly.
- If lists grow large, render with `FlatList` for virtualization.

### Privacy / Security Notes
- Location is sensitive: avoid logging full coordinates in production.
- `baseUrl` is currently `http://localhost:8080` (`src/utils/UrlsUtil.tsx`); production should use env-based configuration and HTTPS.

### Open Questions
- Route grouping: API returns `Route[]` but UI flattens to `Leg[]` (loses “route option” grouping). Should the UI present each `Route` as one option?
- Step summarization: comment mentions “if steps >= 3 show first and last”; current behavior replaces only one middle item with `...`. Confirm intended rule.
- Modes: `travelMode` includes driving/bicycling; define UI behavior if these appear.

### Testing Plan
- Unit: route → legs transform; any future “summarize steps” logic.
- Component: states (no destination, loading, empty, error) and correct row rendering.
- Navigation: tapping a row navigates to `ListWalkAndStopsView` with the correct `leg` params.
- Integration: mock `axios.get(routesUrl)` and validate query param formatting (`origin`, `destination`).

