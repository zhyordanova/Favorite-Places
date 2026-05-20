import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

import PlaceItem from "@/components/places/PlaceItem";
import { Spacing } from "@/constants/layout";
import { Place } from "@/models/place";

interface PlacesListProps {
  places: Place[];
}

export default function PlacesList({ places }: PlacesListProps) {
  const router = useRouter();

  function selectPlaceHandler(id: string) {
    router.push({ pathname: "/place-details", params: { placeId: id } });
  }

  if (!places || places.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>
          No places added yet - start adding some!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={places}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PlaceItem place={item} onSelect={selectPlaceHandler} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    margin: Spacing.lg,
  },

  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  fallbackText: {
    fontSize: 16,
  },
});
