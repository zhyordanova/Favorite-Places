import { Alert, Linking } from "react-native";

import { ALERT_MESSAGES } from "@/constants/messages";

export function showAlert(title: string, message: string): void {
  Alert.alert(title, message);
}

export function showErrorAlert(message: string): void {
  showAlert(ALERT_MESSAGES.errorTitle, message);
}

export function showSettingsAlert(title: string, message: string): void {
  Alert.alert(title, message, [
    { text: "Cancel", style: "cancel" },
    {
      text: ALERT_MESSAGES.openSettings,
      onPress: () => void Linking.openSettings(),
    },
  ]);
}
