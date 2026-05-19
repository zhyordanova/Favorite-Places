import * as LocationModule from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import OutlinedButton from "@/components/UI/OutlinedButton";
import { Colors } from "@/constants/colors";
import { Radius } from "@/constants/layout";
import { sharedStyles } from "@/constants/sharedStyles";
import { usePermission } from "@/hooks/usePermission";
import { usePickedLocation } from "@/store/picked-location-context";
import { Location } from "@/types";
import { getAddress, getMapPreview } from "@/util/location";

interface LocationPickerProps {
  onPickLocation: (location: Location) => void;
  pickedLocation: Location | undefined;
}

function isMapboxConfigError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message.includes("EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN")
  );
}

export default function LocationPicker({
  onPickLocation,
  pickedLocation,
}: LocationPickerProps) {
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const [locationPermissionInformation, requestPermission] =
    LocationModule.useForegroundPermissions();

  const verifyLocationPermission = usePermission(
    locationPermissionInformation,
    requestPermission,
    "You need to grant location permissions to use this app.",
  );

  const router = useRouter();
  const { pickedMapLocation, clearPickedMapLocation } = usePickedLocation();

  useFocusEffect(
    useCallback(() => {
      async function storePickedLocation() {
        if (!pickedMapLocation) {
          return;
        }

        setIsFetchingLocation(true);

        try {
          const address = await getAddress(
            pickedMapLocation.lat,
            pickedMapLocation.lng,
          );
          onPickLocation({ ...pickedMapLocation, address });
        } catch (error) {
          if (isMapboxConfigError(error)) {
            Alert.alert(
              "Configuration Error",
              "Location services are not configured correctly. Please try again later.",
            );
          } else {
            Alert.alert(
              "Geocoding Failed",
              "Could not retrieve the address for the selected location.",
            );
          }
        } finally {
          clearPickedMapLocation();
          setIsFetchingLocation(false);
        }
      }

      storePickedLocation();
    }, [clearPickedMapLocation, onPickLocation, pickedMapLocation]),
  );

  async function verifiedPermissions(): Promise<boolean> {
    return verifyLocationPermission();
  }

  async function getLocationHandler(): Promise<void> {
    try {
      setIsFetchingLocation(true);

      const hasPermission = await verifiedPermissions();

      if (!hasPermission) {
        setIsFetchingLocation(false);
        return;
      }

      if (Platform.OS === "android") {
        const hasServicesEnabled =
          await LocationModule.hasServicesEnabledAsync();

        if (!hasServicesEnabled) {
          Alert.alert(
            "Location Services Disabled",
            "Please enable location services on your device to use this feature.",
          );
          setIsFetchingLocation(false);
          return;
        }
      }

      let location;
      try {
        location = await LocationModule.getCurrentPositionAsync({
          accuracy: LocationModule.Accuracy.High,
        });
      } catch {
        Alert.alert(
          "Location Unavailable",
          "Could not fetch your location. Make sure location services are enabled on your device.",
        );
        setIsFetchingLocation(false);
        return;
      }

      const currentLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      let address: string;
      try {
        address = await getAddress(currentLocation.lat, currentLocation.lng);
      } catch (error) {
        if (isMapboxConfigError(error)) {
          Alert.alert(
            "Configuration Error",
            "Location services are not configured correctly. Please try again later.",
          );
        } else {
          Alert.alert(
            "Geocoding Failed",
            "Could not retrieve the address for your location.",
          );
        }
        setIsFetchingLocation(false);
        return;
      }

      onPickLocation({ ...currentLocation, address });
      setIsFetchingLocation(false);
    } catch {
      Alert.alert(
        "Unexpected Error",
        "An unexpected error occurred while getting your location.",
      );
      setIsFetchingLocation(false);
    }
  }

  function pickOnMapHandler(): void {
    router.navigate("/Map");
  }

  let locationPreview = (
    <Text style={sharedStyles.statusText}>No location picked yet.</Text>
  );

  if (isFetchingLocation) {
    locationPreview = (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.primary700} />
        <Text style={sharedStyles.statusText}>Fetching location...</Text>
      </View>
    );
  }

  if (pickedLocation && !isFetchingLocation) {
    const mapPreviewUri = getMapPreview(pickedLocation.lat, pickedLocation.lng);

    locationPreview = mapPreviewUri ? (
      <Image
        style={styles.mapImage}
        source={{
          uri: mapPreviewUri,
        }}
      />
    ) : (
      <Text style={sharedStyles.statusText}>Map preview unavailable.</Text>
    );
  }

  return (
    <View>
      <View style={sharedStyles.pickerPreview}>{locationPreview}</View>
      <View style={sharedStyles.pickerActions}>
        <OutlinedButton
          icon="location"
          onPress={getLocationHandler}
          disabled={isFetchingLocation}
        >
          {isFetchingLocation ? "Locating..." : "Locate User"}
        </OutlinedButton>

        <OutlinedButton
          icon="map"
          onPress={pickOnMapHandler}
          disabled={isFetchingLocation}
        >
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapImage: {
    width: "100%",
    height: "100%",
    borderRadius: Radius.sm,
  },

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
