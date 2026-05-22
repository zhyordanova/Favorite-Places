import { PermissionStatus } from "expo-modules-core";

import { ALERT_MESSAGES } from "@/constants/messages";
import { logAppError, showAlert, showSettingsAlert } from "@/util/alerts";

interface PermissionInfo {
  status: PermissionStatus;
  canAskAgain?: boolean;
  granted?: boolean;
}

type RequestPermission = () => Promise<{
  granted: boolean;
  canAskAgain?: boolean;
}>;
type GetPermission = () => Promise<PermissionInfo>;

/**
 * Returns an async function that verifies a given permission,
 * requesting it if not yet determined and showing an alert if denied.
 * After the first system prompt denial, it returns silently.
 * When permanently denied (canAskAgain === false), offers a shortcut to system settings.
 * Refreshes permission status on demand before each verification.
 */
export function usePermission(
  permissionInformation: PermissionInfo | null,
  requestPermission: RequestPermission,
  getPermission: GetPermission,
  deniedMessage: string,
): () => Promise<boolean> {
  return async function verifyPermission(): Promise<boolean> {
    let currentPermissionInformation = permissionInformation;

    try {
      currentPermissionInformation = await getPermission();
    } catch (error) {
      logAppError("refresh permission state", error);
      showAlert(
        ALERT_MESSAGES.unexpectedErrorTitle,
        ALERT_MESSAGES.permissionRefreshFailedMessage,
      );
    }

    if (currentPermissionInformation?.granted) {
      return true;
    }

    if (
      !currentPermissionInformation ||
      currentPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (currentPermissionInformation.status === PermissionStatus.DENIED) {
      const settingsMessage =
        currentPermissionInformation.canAskAgain === false
          ? deniedMessage + ALERT_MESSAGES.permissionsDeniedPermanently
          : deniedMessage;

      showSettingsAlert(
        ALERT_MESSAGES.insufficientPermissionsTitle,
        settingsMessage,
      );
      return false;
    }

    return true;
  };
}
