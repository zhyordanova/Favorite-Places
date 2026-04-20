import { useRouter } from "expo-router";
import { Alert } from "react-native";

import PlaceForm from "../components/Places/PlaceForm";
import { Place } from "../models/place";
import { insertPlace } from "../util/database";

export default function AddPlace() {
  const router = useRouter();

  async function createPlaceHandler(place: Place) {
    try {
      await insertPlace(place);
      router.back();
    } catch {
      Alert.alert("Error", "Could not save the place. Please try again.");
    }
  }

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}
