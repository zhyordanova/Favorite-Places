import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import PlacesList from "../components/Places/PlacesList";
import { Place } from "../models/place";
import { fetchPlaces } from "../util/database";

export default function AllPlaces() {
  const [loadedPlaces, setLoadedPlaces] = useState<Place[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadPlaces() {
        try {
          const places = await fetchPlaces();
          setLoadedPlaces(places);
        } catch {
          Alert.alert("Error", "Could not load places. Please restart the app.");
        }
      }

      loadPlaces();
    }, []),
  );

  return <PlacesList places={loadedPlaces} />;
}
