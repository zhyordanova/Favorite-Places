import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import LoadingOverlay from "@/components/ui/LoadingOverlay";
import OutlinedButton from "@/components/ui/OutlinedButton";
import { Colors } from "@/constants/colors";
import { ALERT_MESSAGES } from "@/constants/messages";
import { Place } from "@/models/place";
import { showErrorAlert } from "@/util/alerts";
import { fetchPlaceDetails } from "@/util/database";

export default function PlaceDetails() {
  const router = useRouter();
  const [fetchedPlace, setFetchedPlace] = useState<Place | undefined>();

  function showOnMapHandler() {
    if (!fetchedPlace) return;

    router.push({
      pathname: "/map",
      params: {
        lat: fetchedPlace.location.lat.toString(),
        lng: fetchedPlace.location.lng.toString(),
        placeId,
      },
    });
  }

  const { placeId } = useLocalSearchParams<{ placeId: string }>();

  useEffect(() => {
    async function loadPlaceData() {
      try {
        const place = await fetchPlaceDetails(placeId);
        setFetchedPlace(place);
      } catch {
        showErrorAlert(ALERT_MESSAGES.loadPlaceDetailsFailed);
      }
    }

    loadPlaceData();
  }, [placeId]);

  if (!fetchedPlace) {
    return <LoadingOverlay message="Loading place data..." />;
  }

  return (
    <>
      <Stack.Screen options={{ title: fetchedPlace.title }} />
      <ScrollView>
        <Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />

        <View style={styles.locationContainer}>
          <View style={styles.addressContainer}>
            <Text style={styles.address}>{fetchedPlace.address}</Text>
          </View>

          <OutlinedButton icon="map" onPress={showOnMapHandler}>
            View on Map
          </OutlinedButton>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },

  locationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  addressContainer: {
    padding: 20,
  },

  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
