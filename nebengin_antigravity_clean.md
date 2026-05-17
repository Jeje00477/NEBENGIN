# NEBENGIN — Build Prompt for Antigravity AI

## How to Use This Document

You are an AI builder. This project already has a folder open containing visual design code exported from Figma AI. Do the following in order:

1. **Scan the Figma folder first** — read all existing files to understand the visual style: color palette, component shapes, border radius, spacing, card styles, and typography. Do not use any of this code directly.
2. **Read this entire specification document** before writing a single line of code.
3. **Give me a summary** of what you understood: tech stack, folder structure, total screens, API strategy, and the visual style you detected from the Figma files.
4. **Wait for my confirmation** before starting to build.
5. Once I confirm — **build the entire project from scratch** following this specification exactly, using the Figma files only as visual reference for styling.

The Figma folder is reference material. This document is the source of truth.

---


## Project Overview

Build a complete mobile-web application called **NEBENGIN**, a real-time campus ride-sharing platform for university students in Indonesia (Universitas Brawijaya, Malang). The app connects **drivers** (students with vehicles heading to campus) and **riders** (students who need a ride). All UI must be in **Bahasa Indonesia**. The app must look and feel like a native mobile app running in a browser — optimized for 375px–430px portrait viewport.

---

## Technical Constraints

### TC-1: Technology Stack
- React 18 + Vite as the build tool
- React Router v6 for client-side routing
- Tailwind CSS for styling (mobile-first)
- Axios for all HTTP requests
- No other UI framework (no MUI, no Ant Design, no Chakra)
- No backend required during build — all API calls must go through a centralized API service layer that is pre-structured but returns mock data for now

### TC-2: API Service Layer (PostgreSQL slot)
- Create a single file: `src/services/api.js`
- This file is the **only place** where HTTP requests are made
- All functions in `api.js` must use Axios pointed at a base URL read from `.env`: `VITE_API_BASE_URL`
- Every function must be async and return a structured response object: `{ data, error }`
- During build, each function returns **mock data** that matches the real expected shape
- Add a comment block above every function: `// TODO: Connect to PostgreSQL via Laravel backend — endpoint: [METHOD] [path]`
- This makes it trivial to swap mock → real later by only editing `api.js`

### TC-3: Auth State
- Use React Context (`AuthContext`) to store logged-in user globally
- Store user object and token in `localStorage` under keys `nebengin_user` and `nebengin_token`
- On app load, read from localStorage to restore session
- No real JWT validation needed — just store and read the mock token

### TC-4: Folder Structure
```
nebengin/
├── public/
├── src/
│   ├── assets/            ← icons, illustrations (use placeholder SVGs)
│   ├── components/        ← reusable UI components
│   │   ├── common/        ← Button, Input, Avatar, Badge, BottomNav, MapPlaceholder, StarRating, Modal
│   │   ├── driver/        ← driver-specific components
│   │   └── rider/         ← rider-specific components
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Welcome.jsx
│   │   ├── auth/
│   │   │   ├── DriverAuth.jsx
│   │   │   └── RiderAuth.jsx
│   │   ├── driver/
│   │   │   ├── DriverVehicleSetup.jsx
│   │   │   ├── DriverDashboard.jsx
│   │   │   ├── DriverSetOriginMap.jsx
│   │   │   ├── DriverSetDestinationMap.jsx
│   │   │   ├── DriverRiderList.jsx
│   │   │   ├── DriverActiveTrip.jsx
│   │   │   ├── DriverTripComplete.jsx
│   │   │   ├── DriverHistory.jsx
│   │   │   ├── DriverHistoryDetail.jsx
│   │   │   └── DriverProfile.jsx
│   │   └── rider/
│   │       ├── RiderDashboard.jsx
│   │       ├── RiderSetPickupMap.jsx
│   │       ├── RiderSetDestinationMap.jsx
│   │       ├── RiderWaiting.jsx
│   │       ├── RiderDriverFound.jsx
│   │       ├── RiderNoDriverFound.jsx
│   │       ├── RiderActiveTrip.jsx
│   │       ├── RiderTripComplete.jsx
│   │       ├── RiderHistory.jsx
│   │       ├── RiderHistoryDetail.jsx
│   │       └── RiderProfile.jsx
│   ├── services/
│   │   └── api.js         ← ALL API calls live here only
│   ├── hooks/
│   │   └── usePolling.js  ← custom hook for polling
│   ├── utils/
│   │   └── helpers.js     ← formatDate, formatDistance, etc.
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
└── vite.config.js
```

### TC-5: Environment File
Create `.env` with:
```
VITE_API_BASE_URL=http://localhost:8000/api
```
Create `.env.example` with the same content. Add `.env` to `.gitignore`.

### TC-6: Browser Compatibility
- Must work in Chrome, Firefox, Safari (mobile and desktop)
- Viewport meta tag must be set: `width=device-width, initial-scale=1, maximum-scale=1`

---

## Non-Functional Requirements

### NFR-1: Mobile-First Design
- Max content width: 430px, centered on desktop with a subtle outer background
- All tap targets minimum 44px height
- No horizontal scroll on any screen
- Smooth page transitions using React Router

### NFR-2: Performance
- No unnecessary re-renders
- Images and maps use placeholder components, not real external APIs
- Polling interval for waiting state: every 5 seconds (via `usePolling` hook)

### NFR-3: Visual Design
- Clean, modern, card-based mobile UI
- Consistent use of a primary color (pick one cohesive palette)
- Every screen has a clear header or top bar
- Loading states on all async actions (spinner or skeleton)
- Empty states with an illustration placeholder and helpful text

### NFR-4: No Test Setup
- Do not generate any test files
- Do not install testing libraries

---

## API Service Layer Specification

File: `src/services/api.js`

Below are all functions that must exist. Each must include the TODO comment, use Axios with the base URL from `.env`, and return mock data matching the shape described.

```js
// ─── AUTH ────────────────────────────────────────────────────────────────────

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: POST /auth/register
export async function registerUser({ nama, email, password, role, nomor_wa })

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: POST /auth/login
export async function loginUser({ email, password, role })

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: POST /auth/logout
export async function logoutUser()

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: GET /auth/me
export async function getMe()

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: PATCH /auth/profile
export async function updateProfile({ nama, avatar_url, nomor_wa })

// ─── DRIVER ──────────────────────────────────────────────────────────────────

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: POST /driver/profile
export async function saveDriverVehicle({ jenis_kendaraan, merk_kendaraan, warna_kendaraan, nomor_polisi, kapasitas_kursi })

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: GET /driver/profile
export async function getDriverProfile()

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: PATCH /driver/availability
export async function toggleDriverAvailability()

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: POST /driver/search-riders
// Body: { origin_lat, origin_lng, destination_lat, destination_lng }
// Returns list of nearby riders with direction_score
export async function searchRiders({ origin_lat, origin_lng, destination_lat, destination_lng })

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: POST /driver/confirm-pickup
// Body: { rider_request_ids: [] }
export async function confirmPickup({ riderRequestIds })

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: PATCH /driver/trip/:tripId/pickup-rider
// Body: { rider_id }
export async function markRiderPickedUp({ tripId, riderId })

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: POST /driver/trip/:tripId/complete
export async function completeTrip({ tripId })

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: GET /driver/history
export async function getDriverHistory()

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: GET /driver/history/:tripId
export async function getDriverTripDetail({ tripId })

// ─── RIDER ───────────────────────────────────────────────────────────────────

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: POST /rider/request
// Body: { pickup_lat, pickup_lng, lokasi_jemput_label, destination_lat, destination_lng, tujuan_label }
export async function createRiderRequest({ pickup_lat, pickup_lng, lokasi_jemput_label, destination_lat, destination_lng, tujuan_label })

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: GET /rider/request/status
// Polling endpoint — returns current match status for the active request
// Response shape: { status: 'waiting' | 'matched' | 'timeout', driver: null | {...}, match_id: null | number, cancel_deadline: null | ISO string }
export async function pollRiderRequestStatus()

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: DELETE /rider/request/:requestId
export async function cancelRiderRequest({ requestId })

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: POST /rider/match/:matchId/cancel
// Only callable within 60 seconds of match
export async function cancelMatchByRider({ matchId })

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: GET /rider/active-trip
export async function getRiderActiveTrip()

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: POST /rider/trip/:tripId/complete
export async function completeRiderTrip({ tripId })

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: GET /rider/history
export async function getRiderHistory()

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: GET /rider/history/:tripId
export async function getRiderTripDetail({ tripId })

// ─── RATING ──────────────────────────────────────────────────────────────────

// TODO: Connect to PostgreSQL via Laravel backend — endpoint: POST /rating/:tripId
// Body: { nilai, komentar, arah_rating: 'driver_to_rider' | 'rider_to_driver' }
export async function submitRating({ tripId, nilai, komentar, arah_rating })
```

All mock return values must match realistic Indonesian names, Malang-area addresses, and plausible coordinate values (lat around -7.95 to -8.05, lng around 112.60 to 112.65).

---

## Routing Structure

All routes defined in `App.jsx` using React Router v6.

```
/                          → Welcome.jsx
/auth/driver               → DriverAuth.jsx
/auth/rider                → RiderAuth.jsx

/driver/setup              → DriverVehicleSetup.jsx     (protected: must be logged in as driver)
/driver/dashboard          → DriverDashboard.jsx         (protected)
/driver/set-origin         → DriverSetOriginMap.jsx      (protected)
/driver/set-destination    → DriverSetDestinationMap.jsx (protected)
/driver/riders             → DriverRiderList.jsx         (protected)
/driver/trip/active        → DriverActiveTrip.jsx        (protected)
/driver/trip/complete      → DriverTripComplete.jsx      (protected)
/driver/history            → DriverHistory.jsx           (protected)
/driver/history/:tripId    → DriverHistoryDetail.jsx     (protected)
/driver/profile            → DriverProfile.jsx           (protected)

/rider/dashboard           → RiderDashboard.jsx          (protected: must be logged in as rider)
/rider/set-pickup          → RiderSetPickupMap.jsx       (protected)
/rider/set-destination     → RiderSetDestinationMap.jsx  (protected)
/rider/waiting             → RiderWaiting.jsx            (protected)
/rider/driver-found        → RiderDriverFound.jsx        (protected)
/rider/no-driver           → RiderNoDriverFound.jsx      (protected)
/rider/trip/active         → RiderActiveTrip.jsx         (protected)
/rider/trip/complete       → RiderTripComplete.jsx       (protected)
/rider/history             → RiderHistory.jsx            (protected)
/rider/history/:tripId     → RiderHistoryDetail.jsx      (protected)
/rider/profile             → RiderProfile.jsx            (protected)
```

Protected routes redirect to `/` if no user in AuthContext.
After login as driver → redirect to `/driver/dashboard`.
After login as rider → redirect to `/rider/dashboard`.
After first-time driver register → redirect to `/driver/setup`.
After first-time rider register → redirect to `/rider/dashboard`.

---

## Reusable Components

Build all components in `src/components/common/` before building pages.

### Button.jsx
Props: `label`, `onClick`, `variant` (primary | secondary | outlined | danger | ghost), `fullWidth`, `disabled`, `loading`.
Primary = filled solid. Secondary = lighter fill. Outlined = border only. Danger = red. Ghost = no border, text only.
When `loading=true`, show a small spinner inside the button and disable it.

### Input.jsx
Props: `label`, `placeholder`, `value`, `onChange`, `type` (text | email | password | tel | number), `error`, `hint`, `disabled`.
Show label above the field. Show error text in red below if `error` is set.

### Avatar.jsx
Props: `src`, `nama`, `size` (sm | md | lg).
If `src` is null, show initials from `nama` on a colored circle background.

### Badge.jsx
Props: `label`, `variant` (success | warning | info | danger | neutral).
Small pill-shaped label. Each variant has its own color.

### StarRating.jsx
Props: `value` (0–5), `onChange` (optional — if provided, stars are interactive), `size` (sm | md).
Interactive version: tap a star to set rating. Display version: filled stars based on value, support half stars visually.

### BottomNav.jsx
Props: `role` (driver | rider), `active` (beranda | perjalanan | riwayat | profil).
Fixed at bottom. 4 tabs with icons and labels:
- Beranda (home icon)
- Perjalanan (route/car icon)
- Riwayat (clock icon)
- Profil (person icon)
Tapping each navigates to the correct route based on role.

### MapPlaceholder.jsx
Props: `height`, `showPin`, `pinLabel`, `showRoute`.
A styled div with a subtle grid or dotted pattern background representing a map area around Malang. If `showPin=true`, show a centered pin icon with optional label. If `showRoute=true`, draw a simple SVG curved line from bottom-left to top-right representing a route. This replaces a real map API for now.
Add a comment: `// TODO: Replace with real OSM/Leaflet map component when backend is connected`

### Modal.jsx
Props: `isOpen`, `onClose`, `title`, `children`, `footer`.
Overlay with centered card. Close on backdrop tap or X button.

### BottomSheet.jsx
Props: `isOpen`, `onClose`, `title`, `children`.
Slides up from bottom. Has a drag handle bar at top. Close on backdrop tap.

---

## Screen-by-Screen Requirements

### PAGE: Welcome.jsx — route: `/`
Full-screen layout. App name "NEBENGIN" large at top center. Tagline below: "Bareng ke kampus, lebih mudah." Two large role selection cards stacked vertically (not side by side on mobile):
- Card 1: icon of a person driving + title "Saya Driver" + subtitle "Saya punya kendaraan dan ingin berbagi tumpangan"
- Card 2: icon of a person + title "Saya Rider" + subtitle "Saya butuh tumpangan ke kampus"
Small text at bottom: "Kamu bisa ganti peran kapan saja di pengaturan."
Tapping Driver card → navigate to `/auth/driver`.
Tapping Rider card → navigate to `/auth/rider`.
If user already logged in (check AuthContext), redirect to appropriate dashboard immediately.

---

### PAGE: DriverAuth.jsx — route: `/auth/driver`
Header with back arrow → goes to `/`. Title: "Driver — Masuk atau Daftar".
Two tabs: "Masuk" (default) and "Daftar".

**Tab Masuk:**
- Input email
- Input password (type password)
- Button "Masuk sebagai Driver" (primary, full width)
  - On click: call `loginUser({ email, password, role: 'driver' })`, store result in AuthContext + localStorage, navigate to `/driver/dashboard`
  - Show error message if login fails
- Ghost link below: "Belum punya akun? Daftar" → switches to Daftar tab

**Tab Daftar:**
- Input nama lengkap
- Input email
- Input password
- Input konfirmasi password
- Input nomor WhatsApp — hint text: "Nomor ini akan digunakan rider untuk menghubungi kamu"
- Button "Daftar sebagai Driver" (primary, full width)
  - On click: validate fields (passwords match, all required filled), call `registerUser({ nama, email, password, role: 'driver', nomor_wa })`, store result, navigate to `/driver/setup`
  - Show field-level errors

---

### PAGE: RiderAuth.jsx — route: `/auth/rider`
Same structure as DriverAuth but for rider role. Tab Masuk button: "Masuk sebagai Rider". Tab Daftar button: "Daftar sebagai Rider". On successful login → `/rider/dashboard`. On successful register → `/rider/dashboard` (no setup screen for rider).

---

### PAGE: DriverVehicleSetup.jsx — route: `/driver/setup`
Header: "Data Kendaraan" with NO back arrow (this is a required one-time step).
Subtitle: "Lengkapi data kendaraan sebelum mulai mencari penumpang."
Form fields:
- Vehicle type: two horizontal toggle cards "Motor" and "Mobil" — mutually exclusive selection, visually shows selected state
- Input merk kendaraan (text) — placeholder: "cth. Honda, Yamaha, Toyota"
- Input warna kendaraan (text) — placeholder: "cth. Hitam, Merah, Putih"
- Input nomor polisi (text, auto-uppercase) — placeholder: "cth. N 1234 ABC"
- Capacity stepper: minus button, number display (1–6), plus button — label: "Kapasitas Penumpang (selain kamu)"
Button at bottom: "Simpan dan Mulai" (primary, full width)
On click: call `saveDriverVehicle({...})`, then navigate to `/driver/dashboard`.
Show loading state on button while saving.

---

### PAGE: DriverDashboard.jsx — route: `/driver/dashboard`
Uses `<BottomNav role="driver" active="beranda" />`.
Top bar: greeting "Halo, [nama]!" on the left, avatar on the right (tapping avatar goes to `/driver/profile`).

**Availability toggle card:**
Calls `getDriverProfile()` on mount to get `is_available` status.
Shows green card with "Kamu sedang aktif" or gray card with "Kamu sedang tidak aktif". Toggle switch calls `toggleDriverAvailability()`.

**Action card "Cari Penumpang Sekarang":**
Two location input rows (styled as tappable fields, not real inputs):
- Row 1 — pin icon + label "Titik Asal Kamu" + current value or placeholder "Ketuk untuk pilih lokasi" → tapping navigates to `/driver/set-origin`
- Row 2 — flag icon + label "Tujuan" + default "Kampus Universitas Brawijaya" → tapping navigates to `/driver/set-destination`
Use React state and `sessionStorage` to persist selected origin/destination across navigation.
Primary button "Cari Penumpang" (disabled if either location is empty) → navigates to `/driver/riders`.

---

### PAGE: DriverSetOriginMap.jsx — route: `/driver/set-origin`
Header with back arrow → goes back to `/driver/dashboard`. Title: "Pilih Titik Asal".
Full-height `<MapPlaceholder showPin={true} pinLabel="Asal" />`.
Search bar at top (non-functional, cosmetic only — placeholder "Cari lokasi...").
Floating bottom card: shows placeholder address "Jl. Soekarno-Hatta, Malang" with confirm button "Pakai Lokasi Ini".
On confirm: save `{ lat: -7.9651, lng: 112.6218, label: "Jl. Soekarno-Hatta, Malang" }` to `sessionStorage` key `driver_origin`, navigate back to `/driver/dashboard`.
Add comment: `// TODO: Replace with real map picker using Leaflet + OSM when backend connected`

---

### PAGE: DriverSetDestinationMap.jsx — route: `/driver/set-destination`
Same as DriverSetOriginMap but saves to `sessionStorage` key `driver_destination`. Default address: "Universitas Brawijaya, Malang". Default coords: `{ lat: -7.9518, lng: 112.6144 }`.

---

### PAGE: DriverRiderList.jsx — route: `/driver/riders`
Header with back arrow → `/driver/dashboard`. Title: "Penumpang di Rute Kamu".
On mount: call `searchRiders({ ...origin, ...destination })` with values from sessionStorage.
Show loading skeleton while fetching.
Subtitle: "Ditemukan [N] penumpang yang searah denganmu."
Scrollable list of rider cards. Each card:
- Left: Avatar + nama + star rating (use StarRating component, display only)
- Middle: pickup location label, route compatibility badge (e.g. "Kecocokan 87%"), extra distance text (e.g. "+380m dari rutemuKamu")
- Right: Button "Pilih" (outlined, small) — when selected changes to filled "Dipilih ✓"
Selecting a rider adds them to local state array `selectedRiders`. Deselecting removes them.
Tapping the card body (not the button) opens a `<BottomSheet>` showing:
  - Rider avatar (large), nama, rating, review count
  - Pickup location
  - Route compatibility percentage
  - Simple route diagram: A (driver origin) → B (rider pickup) → C (campus) as SVG dots and line
  - Button "Pilih Penumpang Ini" → adds to selectedRiders, closes sheet
Floating bottom bar (shown when selectedRiders.length > 0):
  - "Kamu memilih [N] penumpang · Sisa kursi: [kapasitas - N]"
  - Button "Konfirmasi Penjemputan" → calls `confirmPickup({ riderRequestIds })`, then navigate to `/driver/trip/active`
  - Cannot select more riders than `kapasitas_kursi`.
Empty state if no riders found: illustration + "Belum ada penumpang yang searah saat ini."

---

### PAGE: DriverActiveTrip.jsx — route: `/driver/trip/active`
Uses `<BottomNav role="driver" active="perjalanan" />`.
Header: "Perjalanan Aktif". Cancel button top right → shows Modal confirmation "Yakin membatalkan?" → on confirm, navigate to `/driver/dashboard`.
Top half: `<MapPlaceholder showRoute={true} height="280px" />` with comment `// TODO: Replace with live map showing driver location and rider pins`.
Bottom half: scrollable list of selected riders. Each row:
- Avatar + nama + alamat jemput
- Status badge (Menunggu Dijemput / Sudah Dijemput / Dibatalkan)
- Button "Sudah Dijemput" → calls `markRiderPickedUp({ tripId, riderId })`, updates badge to "Sudah Dijemput", button disappears
Bottom: Button "Selesaikan Perjalanan" (primary, full width) → calls `completeTrip({ tripId })`, navigate to `/driver/trip/complete`.

---

### PAGE: DriverTripComplete.jsx — route: `/driver/trip/complete`
No bottom nav. No back arrow.
Centered layout: large checkmark icon (green), title "Perjalanan Selesai!", subtitle showing how many riders were picked up.
Summary card: route taken, total riders, distance.
Section "Beri Rating Penumpang": for each rider in the trip, show their avatar + nama + `<StarRating onChange={...} />` + optional komentar Input.
Button "Kirim Rating dan Selesai" → calls `submitRating(...)` for each rated rider, then navigate to `/driver/dashboard`.

---

### PAGE: DriverHistory.jsx — route: `/driver/history`
Uses `<BottomNav role="driver" active="riwayat" />`.
Header: "Riwayat Perjalanan".
Three filter tabs: "Semua" | "Selesai" | "Dibatalkan". Tapping filters the list.
On mount: call `getDriverHistory()`.
Each history card: date + time, route "[asal] → Kampus UB", number of riders, status badge, average star rating received.
Tapping a card navigates to `/driver/history/:tripId`.
Empty state if no history.

---

### PAGE: DriverHistoryDetail.jsx — route: `/driver/history/:tripId`
Header with back arrow → `/driver/history`. Title: "Detail Perjalanan".
On mount: call `getDriverTripDetail({ tripId })`.
Show: date, route, MapPlaceholder, list of riders with their status and ratings given/received.

---

### PAGE: DriverProfile.jsx — route: `/driver/profile`
Uses `<BottomNav role="driver" active="profil" />`.
On mount: call `getDriverProfile()` and `getMe()`.
Shows: large avatar (Avatar component), nama, email, average rating with star display + total trip count.
Section "Kendaraan Saya": vehicle type, brand, color, plate number, capacity. Edit button → navigates to `/driver/setup` (in edit mode, same component).
Section "Akun": list of options as tappable rows:
- "Edit Profil" → opens BottomSheet with editable nama and avatar_url fields, save calls `updateProfile()`
- "Ganti Password" → opens BottomSheet with old password + new password + confirm fields (cosmetic only for now, no API)
- "Ganti Peran" → navigate to `/`
- "Keluar" → Modal confirmation → on confirm, clear AuthContext + localStorage, navigate to `/`

---

### PAGE: RiderDashboard.jsx — route: `/rider/dashboard`
Uses `<BottomNav role="rider" active="beranda" />`.
Top bar: greeting "Halo, [nama]!" + avatar (tapping → `/rider/profile`).

**Action card "Pesan Tumpangan":**
- Tappable field row 1: "Lokasi Jemputmu" → `/rider/set-pickup`
- Tappable field row 2: "Tujuan" default "Kampus Universitas Brawijaya" → `/rider/set-destination`
- Button "Cari Tumpangan" (disabled if pickup not set) → navigate to `/rider/waiting`

**Status section below the card:**
On mount, call `pollRiderRequestStatus()`. If status is `waiting`, show inline status card "Sedang mencari driver..." with cancel button. If status is `matched`, redirect to `/rider/trip/active`. If no active request, show empty state: illustration + "Belum ada tumpangan aktif."

---

### PAGE: RiderSetPickupMap.jsx — route: `/rider/set-pickup`
Identical structure to DriverSetOriginMap but saves to `sessionStorage` key `rider_pickup`. Back → `/rider/dashboard`.

---

### PAGE: RiderSetDestinationMap.jsx — route: `/rider/set-destination`
Identical to DriverSetDestinationMap, saves to `sessionStorage` key `rider_destination`. Back → `/rider/dashboard`.

---

### PAGE: RiderWaiting.jsx — route: `/rider/waiting`
No bottom nav. Full-screen waiting experience.
On mount: call `createRiderRequest({ ...pickup, ...destination })`.
Top half: `<MapPlaceholder showPin={true} pinLabel="Kamu di sini" />` with pulsing ring CSS animation around the pin.
Bottom half:
- Title "Sedang mencari driver untukmu..."
- Subtitle with pickup and destination labels
- Timer counting up from 00:00 (using setInterval, display MM:SS)
- Button "Batalkan Pencarian" (outlined danger) → Modal confirmation → on confirm, call `cancelRiderRequest()`, navigate to `/rider/dashboard`

**Polling logic (use `usePolling` hook, interval 5000ms):**
Call `pollRiderRequestStatus()` every 5 seconds.
- If response `status === 'matched'` → stop polling, navigate to `/rider/driver-found` with driver data in state
- If timer reaches 5:00 (300 seconds) → stop polling, navigate to `/rider/no-driver`

`usePolling.js` hook must accept `(asyncFn, intervalMs, stopConditionFn)` and handle cleanup on unmount.

---

### PAGE: RiderDriverFound.jsx — route: `/rider/driver-found`
No bottom nav. Receives driver data via React Router state.
Top: green animated banner "Driver ditemukan!" slides in from top.
Driver card:
- Large avatar, nama, star rating
- Vehicle: jenis + merk + warna + nomor polisi (e.g. "Motor · Honda Beat · Hitam · N 4521 BX")
- Route compatibility badge
- Estimated pickup: "Estimasi tiba: ~5 menit"
Cancel countdown: circular countdown timer showing 60 seconds. Counts down in real-time using setInterval. Label: "Kamu bisa membatalkan dalam [N] detik"
Two buttons:
- "Batalkan" (outlined danger) — only visible while countdown > 0 — tapping shows Modal confirmation → on confirm call `cancelMatchByRider({ matchId })`, navigate to `/rider/dashboard`
- "Oke, Tunggu Driver" (primary) → navigate to `/rider/trip/active`
When countdown reaches 0: "Batalkan" button disappears, auto-navigate to `/rider/trip/active` after 1 second.

---

### PAGE: RiderNoDriverFound.jsx — route: `/rider/no-driver`
No bottom nav. Centered layout.
Illustration placeholder (simple SVG of empty road). Title: "Belum ada driver tersedia". Body: "Belum ada driver yang cocok dengan rutemuKamu saat ini. Pertimbangkan untuk memesan ojek atau taksi online terlebih dahulu." Two buttons:
- "Coba Lagi" (primary) → navigate to `/rider/waiting`
- "Kembali ke Beranda" (outlined) → navigate to `/rider/dashboard`

---

### PAGE: RiderActiveTrip.jsx — route: `/rider/trip/active`
Uses `<BottomNav role="rider" active="perjalanan" />`.
On mount: call `getRiderActiveTrip()`.
Top: `<MapPlaceholder showRoute={true} height="260px" />` with comment `// TODO: Show live driver location moving toward rider pickup`.
Bottom card: driver avatar + nama + vehicle details (merk, warna, plate). Status text showing current state:
- "Driver sedang dalam perjalanan ke lokasi jemputmu" (waiting state)
- "Kamu sedang dalam perjalanan ke kampus" (picked up state)
Estimated arrival time. WhatsApp button "Hubungi Driver" → opens `https://wa.me/${driver.nomor_wa}` in new tab. Add comment: `// TODO: driver.nomor_wa comes from backend — format 628xxxxxxxxxx`.
Button "Sampai di Tujuan" (for prototype demo) → calls `completeRiderTrip()`, navigate to `/rider/trip/complete`.

---

### PAGE: RiderTripComplete.jsx — route: `/rider/trip/complete`
No bottom nav. No back arrow. Identical structure to DriverTripComplete but rating direction is rider → driver. Button "Kirim Rating" → calls `submitRating({ tripId, nilai, komentar, arah_rating: 'rider_to_driver' })`, navigate to `/rider/dashboard`.

---

### PAGE: RiderHistory.jsx — route: `/rider/history`
Uses `<BottomNav role="rider" active="riwayat" />`. Same structure as DriverHistory. Calls `getRiderHistory()`. Card shows: date, driver name, route, status, rating given. Tapping → `/rider/history/:tripId`.

---

### PAGE: RiderHistoryDetail.jsx — route: `/rider/history/:tripId`
Back → `/rider/history`. Calls `getRiderTripDetail({ tripId })`. Shows trip detail, driver info, MapPlaceholder, rating summary.

---

### PAGE: RiderProfile.jsx — route: `/rider/profile`
Uses `<BottomNav role="rider" active="profil" />`. Same structure as DriverProfile but no vehicle section. Options: Edit Profil, Ganti Password, Ganti Peran, Keluar.

---

## State Management Notes

- `AuthContext` provides: `user`, `token`, `setUser`, `setToken`, `logout()`
- `sessionStorage` is used (not localStorage) for in-progress trip data (origin, destination, selected riders) so it clears on tab close
- Use `useNavigate` from React Router for all programmatic navigation
- Use `useState` + `useEffect` for all local page state
- No Redux, no Zustand

---

## Mock Data Guidelines

All mock responses in `api.js` must use:
- Indonesian full names (e.g. "Ahmad Rizky Pratama", "Siti Nurhaliza", "Budi Santoso")
- Malang street addresses (e.g. "Jl. Soekarno-Hatta No. 45", "Perum. Sawojajar Blok C-12", "Jl. MT. Haryono No. 182")
- Realistic coordinates near UB: lat between -7.93 and -8.02, lng between 112.59 and 112.65
- Vehicle plates starting with "N" (Malang plate prefix), e.g. "N 4521 BX"
- direction_score between 0.61 and 0.99
- Ratings between 3.5 and 5.0

---

## Folder and File Rules

- Only one component per file
- File name matches component name exactly (PascalCase)
- All pages in `src/pages/`, all reusable components in `src/components/`
- `api.js` is the single source of truth for all backend communication — nothing else imports Axios
- Keep code clean with consistent formatting
- No inline styles — use Tailwind classes only
- No commented-out dead code except the `// TODO: Connect to PostgreSQL` and `// TODO: Replace with real map` markers which must be kept

---

## Deployment Notes

- Build with `npm run build`
- Output goes to `dist/` folder
- Can be deployed on Vercel, Netlify, or any static hosting
- When backend is ready: update `VITE_API_BASE_URL` in `.env` and replace mock returns in `api.js` with real Axios calls — no other files need to change


---

## Final Checklist for AI Builder

Before generating any code, confirm you have understood:
- [ ] Tech stack: React 18 + Vite + Tailwind CSS + React Router v6 + Axios
- [ ] All API calls go through `src/services/api.js` only
- [ ] Mock data is used for all API calls — real endpoints added later manually
- [ ] 30 screens total across driver and rider flows
- [ ] Folder structure must match exactly as specified
- [ ] Design visual style comes from the Figma folder already open in this project
- [ ] All UI text in Bahasa Indonesia
- [ ] No test files, no Redux, no UI framework other than Tailwind
