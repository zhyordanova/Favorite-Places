import { useRouter } from "expo-router";

import PlaceForm from "../components/Places/PlaceForm";
import { Place } from "../models/place";
import { insertPlace } from "../util/database";

export default function AddPlace() {
  const router = useRouter();

  async function createPlaceHandler(place: Place) {
    await insertPlace(place);
    router.back();
  }

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}
