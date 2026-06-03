# Favorite Places Expo

## 🎯 Project Overview

**Favorite Places** is a React Native mobile app that lets you save your favorite locations with photos, addresses, and GPS coordinates. Pick places on a map, capture photos with your camera, and build your personal location library with an intuitive offline-first database.

The app demonstrates production-quality React Native architecture with TypeScript, SQLite, custom map markers, and seamless cross-platform support (iOS, Android, Web).

---

## 📸 Features

- 📸 **Camera & Gallery** — Capture new photos or pick from your library
- 🗺️ **Interactive Maps** — Pick locations by tapping the map or use your current GPS position
- 📍 **Auto Address** — Reverse geocoding displays street addresses automatically
- 💾 **Offline Storage** — All places saved locally in SQLite, works without internet
- 🎯 **Custom Markers** — Your place photos appear as styled pins on the map
- ⚡ **Smooth UX** — Optimized map loading with no visual flash on Android/iOS
- 📱 **Cross-Platform** — Native support for iOS, Android, and Web

---

## 🛠️ Tech Stack

| Category         | Technology                               | Why                                             |
| ---------------- | ---------------------------------------- | ----------------------------------------------- |
| **Framework**    | Expo SDK 54                              | Unified iOS/Android development, fast iteration |
| **Routing**      | expo-router                              | Modern file-based routing system                |
| **Language**     | TypeScript 5.9                           | Type safety, better developer experience        |
| **Database**     | expo-sqlite                              | Lightweight local persistence, no server needed |
| **Maps**         | react-native-maps                        | Battle-tested, highly customizable              |
| **Location**     | expo-location                            | GPS access with permission handling             |
| **Media**        | expo-image-picker<br/>expo-media-library | Native camera & gallery integration             |
| **Geocoding**    | Mapbox API                               | Address lookup and static map previews          |
| **Code Quality** | ESLint, Prettier                         | Consistent style and quality standards          |

---

## 💡 What This Project Demonstrates

### ✅ Architecture & Design

- **Clean Separation**: UI components, business logic, data layer clearly separated
- **Database First**: SQL `ORDER BY` used instead of in-memory sorting (scalable approach)
- **Type Safety**: Full TypeScript with no `any` types
- **State Management**: React Context for lightweight, scoped state (map location)
- **Error Handling**: Graceful degradation (fallback markers if custom capture fails)

### ✅ React Native Best Practices

- Custom hooks (`useMarkerImage`, `usePermission`, `useColorScheme`)
- FlatList optimization for lists
- Platform-specific code (web vs. native)
- Permission requests with clear UX
- Loading states and error boundaries

### ✅ Database Design

- Schema with migrations for non-breaking updates
- UUID v4 for unique IDs (cryptographically strong)
- Timestamp-based ordering (reliable across sync)
- Parameterized queries to prevent SQL injection

### ✅ Performance Optimization

- Positioned custom markers off-screen to prevent render flash
- Memoized Context value to avoid unnecessary re-renders
- SQLite B-tree indexing for fast lookups
- Vector icons instead of bundled images

---

## 📂 Project Structure

```
favorite-places/
├── app/                          # Screens (Expo Router)
│   ├── _layout.tsx              # Root layout, DB init, providers
│   ├── index.tsx                # Home (places list)
│   ├── add-place.tsx            # Add new place flow
│   ├── map.tsx                  # Map (pick/view mode)
│   └── place-details.tsx        # Place detail view
│
├── components/
│   ├── places/                  # Domain components
│   │   ├── PlaceForm.tsx
│   │   ├── PlacesList.tsx       # DB-ordered list (no UI sort)
│   │   ├── LocationPicker.tsx
│   │   ├── ImagePicker.tsx
│   │   └── PlaceItem.tsx
│   └── ui/                      # Reusable UI primitives
│       ├── Button.tsx
│       ├── IconButton.tsx
│       ├── LoadingOverlay.tsx
│       ├── OutlinedButton.tsx
│       └── MarkerGenerator.tsx
│
├── hooks/                        # Custom React hooks
│   ├── useMarkerImage.ts
│   ├── usePermission.ts
│   ├── useColorScheme.ts
│   └── useThemeColor.ts
│
├── models/                       # Domain models
│   └── place.ts                 # Place class with UUID generation
│
├── store/                        # Global state
│   └── picked-location-context.tsx  # Map state provider
│
├── types/                        # TypeScript interfaces
│   └── index.ts
│
├── util/                         # Utilities & APIs
│   ├── database.ts              # SQLite CRUD + migrations
│   ├── location.ts              # Mapbox integration
│   └── alerts.ts                # Alert helpers
│
├── constants/                    # App constants
│   ├── colors.ts
│   ├── layout.ts
│   ├── messages.ts
│   └── sharedStyles.ts
│
└── scripts/
    └── reset-project.js
```

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
npm or yarn
Expo CLI: npm install -g expo-cli
iOS Simulator or Android Emulator (or physical device)
```

### Installation

```bash
# Clone and install
git clone <repo-url>
cd FavoritePlaces
npm install

# Set up environment
cp .env.example .env
# Add your Mapbox token to .env

# Start
npm run start
npm run android    # Android Emulator
npm run ios        # iOS Simulator
npm run web        # Web browser
```

### Development Commands

```bash
npm run start           # Start Expo dev server
npm run android         # Run on Android Emulator
npm run ios             # Run on iOS Simulator
npm run web             # Run in browser
npm run lint            # Check code quality
npm run format          # Auto-format code
npm run reset-project   # Clear data and rebuild
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

An `.env.example` file is included in the repository as a template.

Get your token from [Mapbox](https://mapbox.com).

---

## 📋 Permissions Required

The app requests these native permissions:

- **Camera** — To capture new photos
- **Photo Library** — To select existing photos
- **Location** — To get current GPS position or display on map

All permissions are requested with clear explanations and are optional (app works without them).

> **Expo Go limitation:** On Android, saving captured images to the system album via `expo-media-library` is limited in Expo Go. Use a development build (`npm run android` / `npm run ios`) to test full save-to-album behavior.

---

## 🎓 Challenges & Lessons Learned

### 1. **Image Flash Before Map Loads (Android)**

**Problem:** Custom marker image was rendering before map was ready, causing visual flash.

**Solution:**

- Positioned `MarkerGenerator` far off-screen with `opacity: 0`
- Wrapped map in loading overlay until `onMapReady` fires
- Result: Smooth, flicker-free map transitions

**Lesson:** Platform-specific issues require testing on both Android and iOS.

### 2. **ID Generation & Ordering**

**Problem:** Used `Date.toString() + Math.random()` for IDs, then reversed list in UI to show newest first.

**Solution:**

- Replaced with UUID v4 (cryptographically strong, RFC 4122 compliant)
- Added `createdAt` timestamp to database schema
- Moved ordering to SQL layer: `ORDER BY createdAt DESC`
- Removed in-memory `.reverse()` call

**Lesson:** ID generation and ordering belong at the database layer, not the UI.

### 3. **State Management Complexity**

**Problem:** Needed to pass selected location across multiple screens (Map → form).

**Solution:** React Context API for lightweight, scoped state without adding Redux/Zustand.

**Lesson:** Start simple; add complexity only when needed. Context is sufficient for transient, cross-screen state.

### 4. **TypeScript + React Native**

**Lesson:** Full TypeScript typing (no `any`) catches bugs early and makes refactoring safer.

---

## 🔮 Future Improvements

- 📤 **Cloud Sync** — Firebase/Supabase integration for multi-device backup
- 🔐 **Authentication** — User accounts for synced places across devices
- 🏷️ **Collections** — Organize places into favorites, visited, wishlist
- 🔍 **Search** — Full-text search on place names and addresses
- 🗺️ **Export** — Save places as JSON or GeoJSON
- 🌙 **Dark Mode** — Theme switching
- 📊 **Analytics** — Track most-visited places, heatmap view
- ✏️ **Edit/Delete** — Update or remove saved places
- 🔔 **Reminders** — Geofence notifications when near a saved place

---

## 📚 Key Learnings

This project is a great portfolio piece for demonstrating:

- ✅ Full-stack React Native development (UI + database + APIs)
- ✅ TypeScript proficiency with no type-casting
- ✅ Mobile UX best practices (smooth loading, permission handling)
- ✅ Database design (schema, migrations, indexing)
- ✅ Cross-platform thinking (iOS/Android/Web)
- ✅ Component architecture and code organization
- ✅ Performance optimization techniques

---

## 👤 Author

Created as a practical portfolio project demonstrating production-grade React Native architecture and best practices.

For questions or feature ideas, feel free to open an issue or reach out.

---

## 📝 License

Private / Portfolio Use
