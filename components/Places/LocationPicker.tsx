import {
  getCurrentPositionAsync,
  useForegroundPermissions,
} from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/colors";
import { consumePickedMapLocation } from "../../store/picked-location-store";
import { Location } from "../../types";
import { getAddress, getMapPreview } from "../../util/location";
import { usePermission } from "../../hooks/use-permission";
import OutlinedButton from "../UI/OutlinedButton";

interface LocationPickerProps {
  onPickLocation: (location: Location) => void;
  pickedLocation: Location | undefined;
}

function LocationPicker({
  onPickLocation,
  pickedLocation,
}: LocationPickerProps) {
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  const verifyLocationPermission = usePermission(
    locationPermissionInformation,
    requestPermission,
    "You need to grant location permissions to use this app.",
  );

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      async function storePickedLocation() {
        const mapPickedLocation = consumePickedMapLocation();

        if (!mapPickedLocation) {
          return;
        }

        let address: string;
        try {
          address = await getAddress(
            mapPickedLocation.lat,
            mapPickedLocation.lng,
          );
        } catch {
          Alert.alert(
            "Geocoding Failed",
            "Could not retrieve the address for the selected location.",
          );
          return;
        }

        onPickLocation({ ...mapPickedLocation, address });
      }

      storePickedLocation();
    }, [onPickLocation]),
  );

  async function verifiedPermissions(): Promise<boolean> {
    return verifyLocationPermission();
  }

  async function getLocationHandler(): Promise<void> {
    const hasPermission = await verifiedPermissions();

    if (!hasPermission) {
      return;
    }

    let location;
    try {
      location = await getCurrentPositionAsync();
    } catch {
      Alert.alert(
        "Location Unavailable",
        "Could not fetch your location. Make sure location services are enabled on your device.",
      );
      return;
    }

    const currentLocation = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };

    let address: string;
    try {
      address = await getAddress(currentLocation.lat, currentLocation.lng);
    } catch {
      Alert.alert(
        "Geocoding Failed",
        "Could not retrieve the address for your location.",
      );
      return;
    }

    onPickLocation({ ...currentLocation, address });
  }

  function pickOnMapHandler(): void {
    router.navigate("/Map");
  }

  let locationPreview = <Text>No location picked yet.</Text>;

  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.mapImage}
        source={{
          uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
        }}
      />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    height: 200,
    marginVertical: 12,
    marginHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: Colors.primary100,
    borderColor: Colors.primary500,
    borderWidth: 2,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  mapImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
});
