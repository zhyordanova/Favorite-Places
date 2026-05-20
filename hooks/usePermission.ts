import { PermissionStatus } from "expo-modules-core";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

import { ALERT_MESSAGES } from "@/constants/messages";
import { showAlert, showSettingsAlert } from "@/util/alerts";

interface PermissionInfo {
  status: PermissionStatus;
  canAskAgain?: boolean;
}

type RequestPermission = () => Promise<{ granted: boolean }>;
type GetPermission = () => Promise<unknown>;

/**
 * Returns an async function that verifies a given permission,
 * requesting it if not yet determined and showing an alert if denied.
 * When permanently denied (canAskAgain === false), offers a shortcut to system settings.
 * Refreshes permission status automatically when the app returns to the foreground.
 */
export function usePermission(
  permissionInformation: PermissionInfo | null,
  requestPermission: RequestPermission,
  getPermission: GetPermission,
  deniedMessage: string,
): () => Promise<boolean> {
  const getPermissionRef = useRef(getPermission);
  useEffect(() => {
    getPermissionRef.current = getPermission;
  }, [getPermission]);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          void getPermissionRef.current();
        }
        appState.current = nextAppState;
      },
    );
    return () => subscription.remove();
  }, []);
  return async function verifyPermission(): Promise<boolean> {
    if (
      !permissionInformation ||
      permissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (permissionInformation.status === PermissionStatus.DENIED) {
      if (permissionInformation.canAskAgain === false) {
        showSettingsAlert(
          ALERT_MESSAGES.insufficientPermissionsTitle,
          deniedMessage + ALERT_MESSAGES.permissionsDeniedPermanently,
        );
      } else {
        showAlert(ALERT_MESSAGES.insufficientPermissionsTitle, deniedMessage);
      }
      return false;
    }

    return true;
  };
}
