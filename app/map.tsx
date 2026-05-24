import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";

import IconButton from "@/components/ui/IconButton";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import MarkerGenerator from "@/components/ui/MarkerGenerator";
import { ALERT_MESSAGES } from "@/constants/messages";
import { useMarkerImage } from "@/hooks/useMarkerImage";
import { usePickedLocation } from "@/store/picked-location-context";
import { showAlert } from "@/util/alerts";
import { fetchPlaceDetails } from "@/util/database";

export default function Map() {
  const navigation = useNavigation();
  const { setPickedMapLocation } = usePickedLocation();
  const { lat, lng, placeId } = useLocalSearchParams<{
    lat?: string;
    lng?: string;
    placeId?: string;
  }>();

  const initialLocation = lat && lng ? { lat: +lat, lng: +lng } : undefined;

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [isMapReady, setIsMapReady] = useState(false);
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [markerCaptureFailed, setMarkerCaptureFailed] = useState(false);

  useEffect(() => {
    if (!placeId) return;

    fetchPlaceDetails(placeId)
      .then((place) => {
        if (!place?.imageUri) return;
        setImageUri(place.imageUri);
      })
      .catch(() => {
        // Fallback to default marker if place details are unavailable.
      });
  }, [placeId]);

  useEffect(() => {
    setMarkerCaptureFailed(false);
  }, [imageUri, placeId]);

  const { markerImage, setMarkerImage, shouldGenerate } = useMarkerImage({
    imageUri,
    enabled: !!selectedLocation,
  });

  const region = {
    latitude: initialLocation ? initialLocation.lat : 37.78825,
    longitude: initialLocation ? initialLocation.lng : -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event: MapPressEvent) {
    if (initialLocation) return;

    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ lat: latitude, lng: longitude });
  }

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      showAlert(ALERT_MESSAGES.errorTitle, ALERT_MESSAGES.noLocationPicked);
      return;
    }

    setPickedMapLocation(selectedLocation);
    navigation.goBack();
  }, [selectedLocation, navigation, setPickedMapLocation]);

  const markerGeneratedHandler = useCallback(
    (uri: string) => {
      setMarkerCaptureFailed(false);
      setMarkerImage(uri);
    },
    [setMarkerImage],
  );

  const markerGenerationFailedHandler = useCallback(() => {
    setMarkerCaptureFailed(true);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Map",
          headerRight: ({ tintColor }) =>
            selectedLocation && !initialLocation ? (
              <IconButton
                icon="save"
                size={24}
                color={tintColor}
                onPress={savePickedLocationHandler}
              />
            ) : null,
        }}
      />

      {shouldGenerate && imageUri && (
        <MarkerGenerator
          key={placeId ?? "marker-generator"}
          imageUri={imageUri}
          onGenerated={markerGeneratedHandler}
          onFailed={markerGenerationFailedHandler}
        />
      )}

      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={region}
          onPress={selectLocationHandler}
          loadingEnabled
          onMapReady={() => setIsMapReady(true)}
        >
          {selectedLocation &&
            (!placeId || markerImage || markerCaptureFailed) && (
              <Marker
                key={markerImage ?? "default"}
                coordinate={{
                  latitude: selectedLocation.lat,
                  longitude: selectedLocation.lng,
                }}
                image={markerImage ? { uri: markerImage } : undefined}
              />
            )}
        </MapView>

        {!isMapReady ? (
          <View style={styles.loadingOverlay}>
            <LoadingOverlay message="Loading map..." />
          </View>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  map: { flex: 1 },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
  },
});
