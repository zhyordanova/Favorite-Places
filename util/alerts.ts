import { Alert } from "react-native";

import { ALERT_MESSAGES } from "@/constants/messages";

export function showAlert(title: string, message: string): void {
  Alert.alert(title, message);
}

export function showErrorAlert(message: string): void {
  showAlert(ALERT_MESSAGES.errorTitle, message);
}
