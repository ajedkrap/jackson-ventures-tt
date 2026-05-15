# IPOT — Customer QR Ordering

A mobile app for customers to scan a table QR, browse the menu, add items to a cart, place an order, and track its status. Built as a take-home for Jackson Ventures.

[![CI](https://github.com/ajedkrap/jackson-ventures-tt/actions/workflows/ci.yml/badge.svg)](https://github.com/ajedkrap/jackson-ventures-tt/actions/workflows/ci.yml)

## Install the APK

You can install the latest preview build from EAS:

https://expo.dev/accounts/rizqidezza/projects/jackson-ventures-test/builds/8eab63f4-6ef2-4d6e-9a1d-6504d85d6553

Open the link on an Android phone and tap Install.

## Stack

- Expo SDK 54 (managed), React Native 0.81, React 19.1, TypeScript
- Zustand for state, with `persist` for cart and menu cache
- React Navigation 7 (native stack)
- axios for API calls, with a typed error normalizer
- expo-camera for QR scanning
- i18next + react-i18next + expo-localization for English and Indonesian
- Jest with the jest-expo preset for tests
- ESLint flat config (eslint-config-universe) + Prettier
- mockapi.io as the backend

## Getting started

You need Node 20 or newer, and either Expo Go on your phone or a simulator.

```bash
git clone https://github.com/ajedkrap/jackson-ventures-tt.git
cd jackson-ventures-tt
npm ci
```

### Environment

The mockapi URL is in `.env`. `EXPO_PUBLIC_*` vars get inlined into the JS bundle, so they are not secrets. To point at a different backend, change this line:

```
EXPO_PUBLIC_API_BASE_URL=https://<your-mockapi-id>.mockapi.io/api/v1
```

### Run

```bash
npx expo start
```

Press `a` for Android, `i` for iOS, or scan the QR with Expo Go.

### Scripts

```bash
npm run lint        # eslint
npm run lint:fix    # eslint --fix
npm run typecheck   # tsc --noEmit
npm test            # jest
npm run test:watch  # jest --watch
```

## Architecture

```
src/
├── api/           # axios client, error normalizer, endpoints
├── components/    # reusable UI (HeaderCart, LanguageSwitcher)
├── hooks/         # useOrderPolling
├── i18n/          # i18next init + en.json / id.json
├── models/        # types: menu, cart, order
├── navigation/    # RootNavigator + RootStackParamList
├── screens/       # Scanner, Menu, ItemDetail, Cart, OrderConfirmation, OrderTracking
├── state/         # zustand stores: menuStore, cartStore, orderStore
├── theme/         # color, spacing, typography tokens
└── utils/         # cart math, customization validation, qr parsing, formatting
```

### State

Three zustand stores, one per area:

- `menuStore`: current menu and table ID. Persisted to AsyncStorage so the menu still loads offline.
- `cartStore`: line items and customer note. Persisted. Lines dedupe by signature (menuItemId + sorted option IDs).
- `orderStore`: order submission state (loading, error). Not persisted because orders live on the server.

The math (cart totals, customization validation, order payload shape) lives in `src/utils/` as pure functions. That keeps it easy to test without React or zustand.

### Order tracking

`useOrderPolling(orderId)` polls `GET /orders/:id` every 5 seconds. It:

- stops when the order reaches `served`
- stops after 3 errors in a row, with a retry button
- cleans up the timer when the screen unmounts
- returns `{ order, loading, error, retry }`

We use polling because mockapi.io is REST only. With a real backend, swapping to SSE would mean replacing this one hook.

### Error handling

There is one `AppError` class with a `kind` field (`network`, `timeout`, `client`, `server`, `unknown`). The axios interceptor turns raw errors into `AppError` once, so screens can branch on `error.kind` without caring about axios.

## Features

### Required

- [x] QR scanning with manual entry as a fallback
- [x] Menu screen with category tabs, sticky headers, and search
- [x] Cart with quantity controls, customizations, and persistence
- [x] Order submission and confirmation screen
- [x] Item customization with `required` and `max_selections` validation, plus a live price preview

### Bonus

- [x] Order tracking with a polling status timeline
- [x] Offline menu cache
- [x] Accessibility: labels, roles, state, and screen reader announcements
- [x] i18n in English and Indonesian, with a floating switcher that remembers your choice (I'm not a chinese speaker, including chinese may leads misinterpretation)
- [x] CI/CD: GitHub Actions runs lint, typecheck, and tests on every push and PR
- [x] Animations: spring checkmark on order confirmation, cart badge pop on add

## Testing

```bash
npm test
```

34 tests across 3 files:

- `utils/customization.test.ts`: `validateSelection`, `calculateItemTotal`, `toggleOption` (covers radio and checkbox)
- `utils/cart.test.ts`: signature dedupe, line totals, cart totals, and the order payload shape (matches the brief)
- `state/cartStore.test.ts`: add, merge, update, remove, and clear through the store

## Mock backend

There is no public IPOT API, so this project uses mockapi.io. Two resources:

- `menu`: one record per table, with categories, items, and customization groups
- `orders`: POST to create, GET by id to track

mockapi does not advance the order status by itself. To watch the timeline animate from `pending` to `served`, open the mockapi dashboard and edit the order's `status` while the OrderTracking screen is open. The app picks it up within 5 seconds.

## Limitations / future work

- Offline order queueing. Only the menu is cached. Submitting an order needs a network. The next step would be to queue orders locally and retry when the device is back online.
- Menu cache invalidation. The cache is trusted forever (until you scan a different table or reset). A `cachedAt` timestamp with a TTL would be better in production.
- WebSocket or SSE. Polling works for mockapi, but a real backend with push would let us replace the polling hook with a single streaming one.
- Cart signature versioning. `cartStore` is on `v1`. If the signature shape ever changes, bump to `v2` so old cached lines drop cleanly.
- Atomic component layer. Today the UI is screen-scoped, with some duplication (quantity stepper, button styles). A small library (Button, QuantityStepper, SelectionDot, EmptyState, ErrorState) would help.
- Per-screen hooks. Local state, derived values, and handlers all live inline in each screen. Lifting these into per-screen hooks (`useMenuScreen`, `useCartScreen`, etc.) would split rendering from behavior and make testing easier.

## Build

A preview APK is available via EAS at the link at the top of this README.

To build your own:

\`\`\`bash
npx eas-cli build -p android --profile preview
\`\`\`