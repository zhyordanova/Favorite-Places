import { PermissionStatus } from "expo-modules-core";
import { Alert } from "react-native";

interface PermissionInfo {
  status: PermissionStatus;
}

type RequestPermission = () => Promise<{ granted: boolean }>;

/**
 * Returns an async function that verifies a given permission,
 * requesting it if not yet determined and showing an alert if denied.
 */
export function usePermission(
  permissionInformation: PermissionInfo | null,
  requestPermission: RequestPermission,
  deniedMessage: string,
): () => Promise<boolean> {
  return async function verifyPermission(): Promise<boolean> {
    if (
      !permissionInformation ||
      permissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (permissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert("Insufficient Permissions!", deniedMessage);
      return false;
    }

    return true;
  };
}
