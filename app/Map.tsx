import * as FileSystem from "expo-file-system/legacy";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";

import IconButton from "@/components/UI/IconButton";
import MarkerGenerator from "@/components/UI/MarkerGenerator";
import { useMarkerImage } from "@/hooks/useMarkerImage";
import { setPickedMapLocation } from "@/store/picked-location-store";
import { fetchPlaceDetails } from "@/util/database";

export default function Map() {
  const navigation = useNavigation();
  const { lat, lng, placeId } = useLocalSearchParams<{
    lat?: string;
    lng?: string;
    placeId?: string;
  }>();

  const initialLocation = lat && lng ? { lat: +lat, lng: +lng } : undefined;

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [imageUri, setImageUri] = useState<string | undefined>();

  useEffect(() => {
    if (!placeId) return;

    fetchPlaceDetails(placeId)
      .then(async (place) => {
        if (!place?.imageUri) return;

        const base64 = await FileSystem.readAsStringAsync(place.imageUri, {
          encoding: "base64",
        });

        setImageUri(`data:image/jpeg;base64,${base64}`);
      })
      .catch(console.log);
  }, [placeId]);

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
      Alert.alert("No location picked!");
      return;
    }

    setPickedMapLocation(selectedLocation);
    navigation.goBack();
  }, [selectedLocation, navigation]);

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
                onClick={savePickedLocationHandler}
              />
            ) : null,
        }}
      />

      {shouldGenerate && imageUri && (
        <MarkerGenerator
          key={imageUri}
          imageUri={imageUri}
          onGenerated={setMarkerImage}
        />
      )}

      <MapView
        style={styles.map}
        initialRegion={region}
        onPress={selectLocationHandler}
      >

        {selectedLocation && (!placeId || markerImage) && (
          <Marker
            key={markerImage ?? "default"}
            coordinate={{
              latitude: selectedLocation.lat,
              longitude: selectedLocation.lng,
            }}
            title={!placeId ? "Picked Location" : undefined}
            image={markerImage ? { uri: markerImage } : undefined}
          />
        )}
        
      </MapView>
    </>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
