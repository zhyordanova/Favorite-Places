import { PermissionStatus } from "expo-modules-core";
import { useRef } from "react";

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
 * After one denial, the next user attempt shows a shortcut to system settings.
 * Refreshes permission status on demand before each verification.
 */
export function usePermission(
  permissionInformation: PermissionInfo | null,
  requestPermission: RequestPermission,
  getPermission: GetPermission,
  deniedMessage: string,
): () => Promise<boolean> {
  const hasDeniedOnceRef = useRef(false);

  function showSettingsPrompt(): void {
    showSettingsAlert(
      ALERT_MESSAGES.insufficientPermissionsTitle,
      deniedMessage + ALERT_MESSAGES.permissionsDeniedPermanently,
    );
  }

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
      hasDeniedOnceRef.current = false;
      return true;
    }

    if (
      !currentPermissionInformation ||
      currentPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      if (permissionResponse.granted) {
        hasDeniedOnceRef.current = false;
        return true;
      }

      hasDeniedOnceRef.current = true;
      return false;
    }

    if (currentPermissionInformation.status === PermissionStatus.DENIED) {
      if (hasDeniedOnceRef.current) {
        showSettingsPrompt();
        return false;
      }

      if (currentPermissionInformation.canAskAgain === true) {
        const permissionResponse = await requestPermission();
        if (permissionResponse.granted) {
          hasDeniedOnceRef.current = false;
          return true;
        }

        hasDeniedOnceRef.current = true;
        return false;
      }

      showSettingsPrompt();
      return false;
    }

    return true;
  };
}
