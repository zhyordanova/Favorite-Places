import {
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  useMediaLibraryPermissions,
} from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Image, StyleSheet, Text, View } from "react-native";

import OutlinedButton from "@/components/ui/OutlinedButton";
import { PICKER_OPTIONS } from "@/constants/imagePicker";
import { ALERT_MESSAGES } from "@/constants/messages";
import { sharedStyles } from "@/constants/sharedStyles";
import { usePermission } from "@/hooks/usePermission";
import { handleAppError, logAppError, showErrorAlert } from "@/util/alerts";

interface ImagePickerProps {
  onTakeImage: (uri: string) => void;
  selectedImage: string | undefined;
}

function isCameraUnavailableError(error: unknown): boolean {
  return (
    error instanceof Error &&
    /camera not available on simulator/i.test(error.message)
  );
}

export default function ImagePicker({
  onTakeImage,
  selectedImage,
}: ImagePickerProps) {
  const [
    cameraPermissionInformation,
    requestCameraPermission,
    getCameraPermission,
  ] = useCameraPermissions();
  const [
    libraryPermissionInformation,
    requestLibraryPermission,
    getLibraryPermission,
  ] = useMediaLibraryPermissions();

  const verifyCameraPermission = usePermission(
    cameraPermissionInformation,
    requestCameraPermission,
    getCameraPermission,
    "You need to grant camera permissions to use this app.",
  );

  const verifyLibraryPermission = usePermission(
    libraryPermissionInformation,
    requestLibraryPermission,
    getLibraryPermission,
    "You need to grant media library permissions to use this app.",
  );

  async function processImageResult(
    image: Awaited<ReturnType<typeof launchCameraAsync>>,
    saveToLibrary: boolean,
  ): Promise<void> {
    if (image.canceled || !image.assets || image.assets.length === 0) {
      return;
    }
    const uri = image.assets[0].uri;
    if (saveToLibrary) {
      await saveToAlbum(uri);
    }
    onTakeImage(uri);
  }

  async function saveToAlbum(uri: string): Promise<void> {
    const hasPermission = await verifyLibraryPermission();

    if (!hasPermission) {
      return;
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync("FavouritePlaces");
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync("FavouritePlaces", asset, false);
      }
    } catch (error) {
      logAppError("save image to album", error);
      // Saving to album can be unsupported in some environments.
    }
  }

  async function takeImageHandler(): Promise<void> {
    const hasPermission = await verifyCameraPermission();

    if (!hasPermission) {
      return;
    }

    try {
      const image = await launchCameraAsync(PICKER_OPTIONS);
      await processImageResult(image, true);
    } catch (error) {
      if (isCameraUnavailableError(error)) {
        showErrorAlert(ALERT_MESSAGES.cameraUnavailableMessage);
      } else {
        handleAppError(
          "launch camera",
          error,
          ALERT_MESSAGES.imagePickerFailedMessage,
        );
      }
    }
  }

  async function pickImageHandler(): Promise<void> {
    const hasPermission = await verifyLibraryPermission();

    if (!hasPermission) {
      return;
    }

    try {
      const image = await launchImageLibraryAsync({
        ...PICKER_OPTIONS,
        mediaTypes: ["images"],
      });
      await processImageResult(image, false);
    } catch (error) {
      handleAppError(
        "launch image library",
        error,
        ALERT_MESSAGES.imagePickerFailedMessage,
      );
    }
  }

  let imagePreview = (
    <Text style={sharedStyles.statusText}>No image taken yet.</Text>
  );

  if (selectedImage) {
    imagePreview = (
      <Image style={styles.image} source={{ uri: selectedImage }} />
    );
  }

  return (
    <View>
      <View style={sharedStyles.pickerPreview}>{imagePreview}</View>
      <View style={sharedStyles.pickerActions}>
        <OutlinedButton icon="camera" onPress={takeImageHandler}>
          Take Image
        </OutlinedButton>

        <OutlinedButton icon="image" onPress={pickImageHandler}>
          Pick from Gallery
        </OutlinedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});
