import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

import PlaceItem from "./PlaceItem";
import { Place } from "../../models/place";

interface PlacesListProps {
  places: Place[];
}

export default function PlacesList({ places }: PlacesListProps) {
  const router = useRouter();

  function selectPlaceHandler(id: string) {
    router.push({ pathname: "/PlaceDetails", params: { placeId: id } });
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
    margin: 24,
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
