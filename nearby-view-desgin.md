## Nearby (Thumb-first Layout)

Designs the Nearby screen with all high-frequency controls in the thumb zone (bottom). Top area is glance-only context.

### Goals
- One-hand use: stop switching, filtering, refresh/search in bottom dock.
- Reduce navigation: expand rows inline; no extra screens for details.
- Prioritize relevancy: show pinned “For You” buses first; filters as chips.
- Keep context visible: stop name + code always at top without needing interaction.

### Structure
- **Status/App Bar (top)**: system status + simple title “Nearby”.
- **Stop Header**: stop name + code; note that swiping horizontally on this header swaps to next/prev nearby stop.
- **Pinned section (“For You”)**: small stack of cards for favorites/frequent routes; minimal scroll.
- **All Services list**: scrollable list of bus cards; tap card to expand inline (no new screen).
- **Bottom Control Dock (always visible)**:
    - Stops row: 3–4 nearest stop buttons + `More ▾`.
    - Filters row: chips for `⭐ Fav`, `⏱ Soonest`, `♿`, `DD`, `All ▾`.
    - Quick Actions row: `Refresh ⟲`, `Search 🔍`.
- **Bottom Nav**: `Nearby` (active), `Favourite`, `Search`, `BusTravel`.

### Layout Sketch (thumb-first)
```
Top (glance): Status | Title | Stop name + code (swipe to switch)
Body: For You (pinned) → All Services (scroll)
Bottom Dock: Stops row → Filters row → Quick actions
Bottom Nav: Nearby | Favourite | Search | BusTravel
```

### Text Wireframe (thumb-first)
```
┌────────────────────────────────────────────────────┐
│ 10:35                                         5G 🔋 │
├────────────────────────────────────────────────────┤
│  Nearby                                           │
│                                                    │
│  Punggol Stn / Int                                 │
│  Stop Code: 65201                                  │
│  (Swipe stop name area to switch stop)             │
│                                                    │
│  ────────────────────────────────────────────────  │
│  For You (Pinned)                                  │
│  ┌──────────────────────────────────────────────┐  │
│  │  39   ♿            ┌──────────────┐          │  │
│  │                    │     3 min    │          │  │
│  │                    │   12, 19     │          │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  43                ┌──────────────┐          │  │
│  │                    │     Arr      │          │  │
│  │                    │    8, 16     │          │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  All Services (Scroll)                             │
│  ┌──────────────────────────────────────────────┐  │
│  │ 118  DD           ┌──────────────┐           │  │
│  │                   │     7 min    │           │  │
│  │                   │   21, 35     │           │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ 50               ┌──────────────┐            │  │
│  │                  │ No Estimate  │            │  │
│  │                  │ Available    │            │  │
│  └──────────────────────────────────────────────┘  │
│  (More rows...)                                    │
├────────────────────────────────────────────────────┤
│  THUMB ZONE (Bottom Control Dock)                  │
│                                                    │
│  Stops:  [65201]  [65209]  [65089]  [More ▾]       │
│                                                    │
│  Filters: [⭐ Fav] [⏱ Soonest] [♿] [DD] [All ▾]    │
│                                                    │
│  Quick Actions:   [Refresh ⟲]   [Search 🔍]        │
├────────────────────────────────────────────────────┤
│  ⌁ Nearby   ♡ Favourite    🔍 Search    🚌 BusTravel│
└────────────────────────────────────────────────────┘
```

### Expanded Row (inline)
```
┌──────────────────────────────────────────────┐
│  39   ♿                                     ▼ │
│        ┌──────────────┐                      │
│        │    3 min     │                      │
│        │   12, 19     │                      │
│                                          ▼   │
│  Next buses: 12 min, 19 min                 │
│  Last updated: 10:35:12                     │
│  [Notify me]    [Add to Favorites ⭐]        │
└──────────────────────────────────────────────┘
```

### Bus Card
- **Collapsed**: route number + tags (♿, DD), ETA pill (e.g., `3 min`, `Arr`, `No Estimate`), next two buses in small text.
- **Expanded (tap once)**:
    - Next buses line (e.g., `Next: 12 min, 19 min`).
    - Last updated timestamp.
    - Actions: `[Notify me]`, `[Add to Favorites ⭐]`.

### Gestures & Controls
- Swipe on stop header to switch between nearby stops.
- Tap stop buttons in bottom dock to jump to that stop; `More ▾` opens selector.
- Filters are toggles; `All ▾` opens full filter sheet if needed.
- Refresh button triggers data refresh; pull-to-refresh optional but not primary.
- Search opens inline search overlay from bottom for quick route lookup.

### States
- **Loading**: shimmer for cards; bottom dock stays interactive (except refresh disabled).
- **Empty**: “No arrivals” + retry; keep stop context + filters visible.
- **Error/Offline**: inline banner near top; “Try again” in quick actions row; stale data timestamp shown on cards.

### Accessibility & Reach
- Keep bottom dock within thumb zone; ensure tap targets ≥44pt.
- High-contrast tags for ♿ and DD; voice-over labels include route, ETA, accessibility tags, and stop name.
- Announce refresh completion and data age.

### Visual Notes
- Use card grouping with subtle elevation for pinned vs list.
- Consistent ETA pill color (e.g., green for imminent, amber for moderate, gray for unknown).
- Keep bottom dock background slightly elevated with divider to separate from scroll content.
