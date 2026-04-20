import {
  launchCameraAsync,
  launchImageLibraryAsync,
  PermissionStatus,
  useCameraPermissions,
  useMediaLibraryPermissions,
} from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

import OutlinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import { PICKER_OPTIONS } from "../../constants/imagePicker";

interface ImagePickerProps {
  onTakeImage: (uri: string) => void;
  selectedImage: string | undefined;
}

function ImagePicker({ onTakeImage, selectedImage }: ImagePickerProps) {
  const [cameraPermissionInformation, requestCameraPermission] =
    useCameraPermissions();
  const [libraryPermissionInformation, requestLibraryPermission] =
    useMediaLibraryPermissions();

  async function verifyCameraPermissions(): Promise<boolean> {
    if (!cameraPermissionInformation) {
      const permissionResponse = await requestCameraPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestCameraPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app.",
      );
      return false;
    }

    return true;
  }

  async function verifyLibraryPermissions(): Promise<boolean> {
    if (!libraryPermissionInformation) {
      const permissionResponse = await requestLibraryPermission();
      return permissionResponse.granted;
    }

    if (libraryPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestLibraryPermission();
      return permissionResponse.granted;
    }

    if (libraryPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant media library permissions to use this app.",
      );
      return false;
    }

    return true;
  }

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
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync("FavouritePlaces");
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync("FavouritePlaces", asset, false);
      }
    } catch {
      // Saving to album not supported in this environment (e.g. Expo Go)
    }
  }

  async function takeImageHandler(): Promise<void> {
    const hasPermission = await verifyCameraPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync(PICKER_OPTIONS);
    await processImageResult(image, true);
  }

  async function pickImageHandler(): Promise<void> {
    const hasPermission = await verifyLibraryPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchImageLibraryAsync({ ...PICKER_OPTIONS, mediaTypes: ["images"] });
    await processImageResult(image, false);
  }

  let imagePreview = <Text>No image taken yet.</Text>;

  if (selectedImage) {
    imagePreview = (
      <Image style={styles.image} source={{ uri: selectedImage }} />
    );
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <View style={styles.actions}>
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

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
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
  image: {
    width: "100%",
    height: "100%",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
