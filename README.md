# FavouritePlaces

A React Native app for saving your favourite locations with photos, addresses, and map coordinates.

## Features

- Add places with a title, photo, and location
- Take photos with the camera or pick from gallery (saved to a "FavouritePlaces" album)
- Pick location from map or use current GPS location
- Reverse geocoding via Mapbox API
- Persistent storage with SQLite
- View place details and see location on map
- Custom photo marker on the map — the place's photo is rendered as a styled pin (circle + pointer)

## Tech Stack

- [Expo SDK 54](https://expo.dev) with file-based routing (expo-router)
- TypeScript
- expo-sqlite — local database
- expo-location — GPS
- expo-image-picker & expo-media-library — camera and gallery
- expo-file-system — reading image files as base64
- react-native-maps — interactive map
- react-native-view-shot — capturing custom marker view as image
- Mapbox API — map preview and reverse geocoding

## Project Structure

```
app/          # Screens (file-based routes)
components/   # Reusable UI components
  Places/     # Place list and form components
  UI/         # Shared UI (buttons, MarkerGenerator, etc.)
hooks/        # Custom hooks (useMarkerImage)
models/       # Place class
store/        # In-memory state (picked location)
types/        # Shared TypeScript interfaces
util/         # Database and API utilities
```

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example` and add your Mapbox token

   ```bash
   cp .env.example .env
   ```

3. Start the app
   ```bash
   npx expo start
   ```
