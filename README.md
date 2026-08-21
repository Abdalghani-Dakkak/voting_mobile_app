# Quick Voting — Mobile (Expo)

React Native / Expo port of the Quick Voting web front-end (`client/`), built with **Expo Router**, **NativeWind** (Tailwind for RN), and **axios**.

## What's implemented

The core voter-facing flow, visually matched to the web app:

- **Home** — dark hero, features, how-it-works, CTA
- **Signup** — "Connect Wallet" screen
- **Poll List** — active / upcoming / closed polls
- **Poll Details** — ranked candidate selection + submit
- **Poll Results** — winner card
- **Profile** — avatar, username, wallet address, logout
- **Create Poll** — 3-step wizard (details → configuration → candidates)

Admin panel, Org dashboard, and Auditor dashboard from the web app are **not** included in this pass.

## What's mocked (by design)

The web app authenticates via **Web3Auth's browser wallet modal + wagmi**, which has no drop-in React Native equivalent. This build replaces that with a local mock (`src/context/AuthContext.jsx`, backed by `AsyncStorage`):

- "Connect Wallet" generates a fake address and stores a role locally — no real wallet/signature.
- The **Profile** screen has a "Demo role" switcher (User / Organization / Auditor) so you can test role-gated screens like Create Poll without a real backend session.
- Vote submission and poll creation call the same shape of request the web app would, but since there's no real signed session, writes will fail against a real backend's auth middleware — that's expected. Reads (poll list, poll details, candidates, tally results) hit the real Express API and work today, since those endpoints are public.

Wire up real auth later with a mobile wallet SDK (e.g. Reown/WalletConnect AppKit for RN) against the existing `/auth/challenge` + `/auth/verify` endpoints in `server/`.

## Running it

```bash
npm install
npm run web      # or: npm run android / npm run ios
```

### Connecting to your local backend (`server/`)

By default the API client (`src/api/client.js`) points at `http://localhost:3000`. That works for `npm run web` and iOS Simulator, but:

- **Android emulator**: use `http://10.0.2.2:3000`
- **Physical device**: use your machine's LAN IP, e.g. `http://192.168.1.23:3000`

Set it via `app.json` → `expo.extra.apiUrl`, e.g.:

```json
{
  "expo": {
    "extra": { "apiUrl": "http://192.168.1.23:3000" }
  }
}
```

## Stack

- Expo SDK 57 + Expo Router (file-based routing in `app/`)
- NativeWind v4 (Tailwind classes on RN components)
- axios for all backend calls
- lucide-react-native for icons (parity with the web app's lucide-react)
- expo-linear-gradient / @react-native-masked-view for gradient effects
- @react-native-community/datetimepicker, expo-document-picker, expo-image-picker for the Create Poll wizard
