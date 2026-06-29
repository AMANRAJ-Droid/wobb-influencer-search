# Wobb Influencer Search — Submission

A redesigned and fully implemented version of the Wobb frontend take-home assignment.

**Live demo:** _https://wobb-influencer-search.vercel.app/_

---

## What I Changed

### Bugs Fixed

| # | Location | Bug | Fix |
|---|---|---|---|
| 1 | `ProfileDetailPage.tsx` | Engagement rate multiplied by **10,000** instead of 100, showing 100× inflated percentages | Changed to `× 100` via shared `formatEngagementRate()` |
| 2 | `ProfileDetailPage.tsx` | "Engagements" stat card displayed `formatEngagementRate(user.engagement_rate)` — the rate, not the raw engagement count | Fixed to show `user.engagements` via `formatEngagements()` |
| 3 | `utils/dataHelpers.ts` | `filterProfiles` compared usernames **case-sensitively** (`p.username.includes(query)`) so "MrBeast" wouldn't match "mrbeast" | Lowercased both sides before comparison |
| 4 | `components/ProfileCard.tsx` | `formatFollowersLocal` was a private duplicate of the shared `formatFollowers` utility | Removed duplicate; now imports from `utils/formatters.ts` |
| 5 | `pages/SearchPage.tsx` | `clickCount` state was never rendered — just `console.log`'d. Also used `setClickCount(clickCount + 1)` (stale closure) instead of the updater form | Removed the state entirely; navigation moved to `ProfileCard` |
| 6 | `components/ProfileCard.tsx` | Fixed `w-[700px]` made cards overflow on any viewport narrower than 700px | Replaced with responsive grid layout |
| 7 | `components/ProfileCard.tsx` | `data-search={searchQuery}` attached the current query string as a DOM attribute on every card render | Removed |
| 8 | `components/SearchBar.tsx` | Component existed but was never imported or used anywhere | Removed |
| 9 | `package.json` | `react-beautiful-dnd` was listed as a dependency but never imported | Removed |

### State Management: Zustand

Replaced the absence of React Context (the starter had no shared state at all) with a **Zustand store** (`src/store/listStore.ts`).

- Uses `zustand/middleware`'s `persist` for **automatic localStorage sync** — the list survives page refresh with zero manual `useEffect` boilerplate
- Store exposes `addToList`, `removeFromList`, `isInList`, `clearList`
- Duplicate prevention is handled inside the store (not in the UI layer)
- Components subscribe to exactly the slice they need (`s => s.isInList`) to avoid unnecessary re-renders

### "Add to List" Feature

- **ProfileCard**: inline toggle button (Add / Added). Turns to a remove-on-hover affordance when already added.
- **ProfileDetailPage**: full-width "Add to List" / "Added to List" button with matching toggle behaviour.
- **SelectedList sidebar**: sticky right panel showing all saved profiles with platform dot indicator, follower count, click-to-profile navigation, per-item remove on hover, and a bulk Clear button.
- No duplicates: guarded in the store.
- Persistent: `zustand/middleware persist` writes to `localStorage` key `wobb-influencer-list`.

### UI / UX Redesign

- **Layout**: sticky top nav with brand mark; responsive `max-w-7xl` container
- **Platform filter**: pill-tab group with platform-specific active colours (pink = Instagram, red = YouTube, slate = TikTok), platform icons, contained in a `bg-gray-100` pill track
- **Search input**: floating label style with leading search icon and clear (×) button when non-empty
- **Profile grid**: responsive 2-column grid replacing the fixed-width stacked list
- **Profile cards**: avatar with verified badge overlay, follower and engagement rate inline stats, smooth hover border + shadow transitions, keyboard-accessible (`role=button`, `tabIndex`, `Enter` handler, `focus-visible` ring)
- **Profile detail**: skeleton loading state (pulse animation), stat grid with icons, accessible external link
- **Empty state**: illustrated empty state with copy when no search results match

### Performance

- `useMemo` on `extractProfiles(platform)` and `filterProfiles(allProfiles, query)` in `SearchPage` — avoids redundant data processing on every keystroke
- `useCallback` on event handlers in `SearchPage`, `ProfileCard`, `SelectedList`, and `ProfileDetailPage`
- `React.memo` on `ProfileCard` — skips re-render when profile/platform props haven't changed
- `loading="lazy"` on all `<img>` tags
- `onError` fallback on all avatar images (→ `ui-avatars.com` placeholder)

### Code Quality

```
src/
├── components/
│   ├── ui/
│   │   └── Badge.tsx          ← primitive
│   ├── Layout.tsx
│   ├── PlatformFilter.tsx
│   ├── ProfileCard.tsx        ← memoized
│   ├── ProfileGrid.tsx        ← replaces ProfileList
│   ├── SelectedList.tsx       ← new: list panel
│   └── VerifiedBadge.tsx
├── pages/
│   ├── SearchPage.tsx
│   └── ProfileDetailPage.tsx
├── store/
│   └── listStore.ts           ← Zustand
├── types/
│   └── index.ts               ← all types here, not in App.tsx
└── utils/
    ├── dataHelpers.ts
    ├── formatters.ts          ← single source of truth for formatting
    └── profileLoader.ts
```

- All types live in `src/types/index.ts` — none leaked into `App.tsx`
- `formatters.ts` is the single source of truth for number formatting (no per-component duplicates)
- `PLATFORM_COLORS` and `PLATFORM_LABELS` extracted to `dataHelpers.ts` for DRY platform styling

### Libraries Added

| Library | Why |
|---|---|
| `zustand` | Lightweight state management with built-in `persist` middleware for localStorage |
| `lucide-react` | Consistent, tree-shakeable icon set |

### Libraries Removed

| Library | Why |
|---|---|
| `react-beautiful-dnd` | Was installed but never used anywhere in the codebase |

---

## Assumptions & Trade-offs

- **No dedicated "Lists" page**: the sidebar panel keeps the UX in one place. A multi-list feature (create named lists, move profiles between lists) would be the next step.
- **Sidebar hidden on mobile**: the selected list is accessible only on `lg:` breakpoints. On mobile, feedback comes from the button toggling to "Added". A bottom sheet or drawer would improve the mobile experience.
- **No tests written**: given the 2-day window and the scope of the redesign, I prioritised correctness and coverage of the required features. Unit tests for `filterProfiles`, `formatEngagementRate`, and the Zustand store would be the first additions.
- **Static JSON data**: no network layer needed. If this were a real API, I'd add React Query for caching and loading states.

---

## Running Locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run lint       # ESLint
```
