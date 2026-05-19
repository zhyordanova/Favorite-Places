import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import PlacesList from "@/components/Places/PlacesList";
import { Colors } from "@/constants/colors";
import { ALERT_MESSAGES } from "@/constants/messages";
import { Place } from "@/models/place";
import { showErrorAlert } from "@/util/alerts";
import { fetchPlaces } from "@/util/database";

export default function AllPlaces() {
  const [loadedPlaces, setLoadedPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function loadPlaces() {
        setIsLoading(true);
        setError(false);
        try {
          const places = await fetchPlaces();
          setLoadedPlaces(places);
        } catch {
          setError(true);
          showErrorAlert(ALERT_MESSAGES.loadPlacesFailed);
        } finally {
          setIsLoading(false);
        }
      }

      loadPlaces();
    }, []),
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary500} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load places.</Text>
      </View>
    );
  }

  return <PlacesList places={loadedPlaces} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    color: Colors.primary500,
    fontSize: 16,
  },
});
