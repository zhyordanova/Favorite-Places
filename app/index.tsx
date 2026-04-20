import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import PlacesList from "../components/Places/PlacesList";
import { Place } from "../models/place";
import { fetchPlaces } from "../util/database";

export default function AllPlaces() {
  const [loadedPlaces, setLoadedPlaces] = useState<Place[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadPlaces() {
        const places = await fetchPlaces();
        setLoadedPlaces(places);
      }

      loadPlaces();
    }, []),
  );

  return <PlacesList places={loadedPlaces} />;
}
