import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";

import IconButton from "@/components/UI/IconButton";
import { setPickedMapLocation } from "@/store/picked-location-store";

export default function Map() {
  const navigation = useNavigation();
  const { lat, lng } = useLocalSearchParams<{ lat?: string; lng?: string }>();

  const initialLocation = lat && lng && { lat: +lat, lng: +lng };

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const region = {
    latitude: initialLocation ? initialLocation.lat : 37.78825,
    longitude: initialLocation ? initialLocation.lng : -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event: MapPressEvent) {
    if (initialLocation) {
      return;
    }

    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({ lat, lng });
  }

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        "No location picked!",
        "You have to pick a location (by tapping on the map) first!",
      );
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
      <MapView
        style={styles.map}
        initialRegion={region}
        onPress={selectLocationHandler}
      >
        {selectedLocation && (
          <Marker
            title="Picked Location"
            coordinate={{
              latitude: selectedLocation.lat,
              longitude: selectedLocation.lng,
            }}
          />
        )}
      </MapView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
