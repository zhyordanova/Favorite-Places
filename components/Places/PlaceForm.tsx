import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import ImagePicker from "@/components/Places/ImagePicker";
import LocationPicker from "@/components/Places/LocationPicker";
import Button from "@/components/UI/Button";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/layout";
import { Place } from "@/models/place";
import { Location } from "@/types";

interface PlaceFormProps {
  onCreatePlace: (place: Place) => void;
}

export default function PlaceForm({ onCreatePlace }: PlaceFormProps) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [pickedLocation, setPickedLocation] = useState<Location | undefined>();

  function changeTitleHandler(enteredText: string) {
    setEnteredTitle(enteredText);
  }

  function takeImageHandler(imageUri: string) {
    setSelectedImage(imageUri);
  }

  const pickLocationHandler = useCallback((location: Location) => {
    setPickedLocation(location);
  }, []);

  function savePlaceHandler() {
    const placeData = new Place(enteredTitle, selectedImage!, pickedLocation!);
    onCreatePlace(placeData);
  }

  const isFormValid =
    enteredTitle.trim().length > 0 && !!selectedImage && !!pickedLocation;

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={enteredTitle}
        />
      </View>

      <ImagePicker
        onTakeImage={takeImageHandler}
        selectedImage={selectedImage}
      />

      <LocationPicker
        onPickLocation={pickLocationHandler}
        pickedLocation={pickedLocation}
      />

      <Button onPress={savePlaceHandler} disabled={!isFormValid}>
        Add Place
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: Spacing.lg,
  },

  label: {
    fontWeight: "bold",
    marginBottom: Spacing.xs,
    color: Colors.primary500,
  },

  input: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    borderColor: Colors.primary500,
    borderWidth: 2,
    backgroundColor: Colors.primary100,
  },
});
