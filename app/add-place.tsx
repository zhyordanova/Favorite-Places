import { useRouter } from "expo-router";

import PlaceForm from "@/components/places/PlaceForm";
import { ALERT_MESSAGES } from "@/constants/messages";
import { Place } from "@/models/place";
import { handleAppError } from "@/util/alerts";
import { insertPlace } from "@/util/database";

export default function AddPlace() {
  const router = useRouter();

  async function createPlaceHandler(place: Place) {
    try {
      await insertPlace(place);
      router.back();
    } catch (error) {
      handleAppError("save place", error, ALERT_MESSAGES.savePlaceFailed);
    }
  }

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}
