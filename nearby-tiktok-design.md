## Nearby (TikTok-Lite Feed)

Designs the Nearby screen like a short, vertical feed with big cards and minimal gesture dependence. The primary actions are visible as buttons in the top bar and on cards; swipe is optional, not required.

### Goals
- Reduce gestures: no hidden swipe-only actions; all core actions are visible.
- One-hand use: actions clustered in the top bar and within each card.
- Fast scanning: large route number, ETA pill, and next buses at a glance.
- Easy switching: stop selector is a clear button, not a swipe-only affordance.

### Structure
- **Status/App Bar (top)**: title "Nearby" + location indicator + refresh time + quick actions.
- **Stop Selector Bar**: current stop name + code + `Change Stop` button.
- **Feed Stack (vertical)**: each route is a full-width card; tap to expand.
- **Bottom Nav**: `Nearby` (active), `Favourite`, `Search`, `BusTravel`.

### Layout Sketch (feed-first)
```
Top: Status | Nearby | Updated 10:35
Stop Bar: [Punggol Stn / 65201] [Change Stop]
Feed: Card 1, Card 2, Card 3... (Favorites pinned to top; both sections sorted by ETA ascending; scroll)
Bottom Nav: Nearby | Favourite | Search | BusTravel
```

### Text Wireframe (TikTok-lite)
```
┌────────────────────────────────────────────────────┐
│ 10:35                                         5G    │
├────────────────────────────────────────────────────┤
│ Nearby   Updated: 10:35   [Search] [Filter] [⟲]    │
│                                                    │
│ [Punggol Stn / 65201]           [Change Stop]      │
│                                                    │
│ ┌───────────────────────────────────────────────┐  │
│ │  39   Tags: Accessible                          │  │
│ │  ETA: 3 min        Next: 12 min, 19 min          │  │
│ │  To: Tampines Int                                │  │
│ │                                                   │
│ │  [Notify]   [Save]   [Details]                    │  │
│ └───────────────────────────────────────────────┘  │
│ ┌───────────────────────────────────────────────┐  │
│ │  43   Tags: None                                │  │
│ │  ETA: Arr         Next: 8 min, 16 min            │  │
│ │  To: Changi Airport                               │  │
│ │                                                   │
│ │  [Notify]   [Save]   [Details]                    │  │
│ └───────────────────────────────────────────────┘  │
│ (More cards...)                                     │
│ Nearby   Favourite   Search   BusTravel            │
└────────────────────────────────────────────────────┘
```

### Card Behavior
- **Collapsed (default)**: route number, ETA, next buses, destination, tags.
- **Expanded (tap once)**:
  - Full stops list preview (first 3 stops).
  - Last updated timestamp.
  - Actions: `Notify`, `Save`, `Share` (`Save` stores this route card into `Favourite`).
- **Details** button opens a lightweight modal sheet (no navigation stack).

### Interaction Model (low-gesture)
- Tap `Change Stop` to open a bottom sheet with nearby stops and search.
- Swipe left/right on the stop selector bar to switch to previous/next nearby stop.
- Tap `Filter` in the top bar for a compact sheet: `Soonest`, `Accessible`, `DD`, `Express`.
- Tap the top-bar refresh icon (no pull-to-refresh required).
- Sorting: Favorites are pinned at the top, and within both Favorites and non-Favorites, cards are sorted by ETA ascending.
- Auto-refresh strategy:
  - Interval: refresh every 30s while the screen is visible.
  - Throttle: pause auto-refresh during active scroll; resume 2s after scrolling stops.
  - Stale handling: if no data update in 90s, show "Stale" badge on cards and a subtle top-bar indicator.
  - Background: stop auto-refresh when app is backgrounded; refresh once on return.
- Swipe is optional:
  - Vertical scroll only for feed.
  - Left/right swipe is reserved for the stop selector bar; cards have no swipe actions.

### Visual Direction
- **Typography**: strong route number (display weight), compact meta text.
- **ETA Pill**: high-contrast badge; green for <5 min, amber for 5-10, gray for no estimate.
- **Card**: full-width, soft corner radius, clear internal spacing.
- **Background**: light neutral with faint gradient band behind the stop bar.

### Motion
- Card reveal on scroll (staggered, 60-80ms).
- Expand/collapse with quick height animation (150-200ms).
- Bottom sheet slides up with spring ease; no parallax or heavy effects.

### States
- **Loading**: skeleton cards, top bar shows "Updating...".
- **Empty**: one card with "No arrivals" + inline `Refresh` button.
- **Offline**: sticky banner under app bar + show last updated time on each card.

### Accessibility
- Tap targets minimum 44pt.
- VoiceOver label includes route, ETA, destination, tags.
- High-contrast ETA pill and tags.

### Notes on TikTok Similarity
- Visual rhythm: tall cards in a vertical feed.
- Single-axis scroll; no hidden gestures.
- Primary actions live on the card and top bar, not on swipe.
