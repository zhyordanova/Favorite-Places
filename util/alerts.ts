import { Alert, Linking } from "react-native";

import { ALERT_MESSAGES } from "@/constants/messages";

export function showAlert(title: string, message: string): void {
  Alert.alert(title, message);
}

export function showErrorAlert(message: string): void {
  showAlert(ALERT_MESSAGES.errorTitle, message);
}

export function logAppError(context: string, error: unknown): void {
  console.error(`[AppError] ${context}`, error);
}

export function handleAppError(
  context: string,
  error: unknown,
  userMessage: string,
): void {
  logAppError(context, error);
  showErrorAlert(userMessage);
}

export function showSettingsAlert(title: string, message: string): void {
  Alert.alert(title, message, [
    { text: "Cancel", style: "cancel" },
    {
      text: ALERT_MESSAGES.openSettings,
      onPress: () => {
        void Linking.openSettings().catch((error: unknown) => {
          handleAppError(
            "open settings",
            error,
            ALERT_MESSAGES.openSettingsFailedMessage,
          );
        });
      },
    },
  ]);
}
