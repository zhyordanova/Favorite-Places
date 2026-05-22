export const ALERT_MESSAGES = {
  errorTitle: "Error",
  loadPlacesFailed: "Could not load places. Please restart the app.",
  savePlaceFailed: "Could not save the place. Please try again.",
  loadPlaceDetailsFailed: "Could not load place details. Please try again.",
  invalidFormTitle: "Invalid form",
  invalidFormMessage: "Please add title, image, and location.",
  noLocationPicked: "No location picked!",
  insufficientPermissionsTitle: "Insufficient Permissions!",
  configErrorTitle: "Configuration Error",
  configErrorMessage:
    "Map or geocoding configuration is missing or invalid. Please check the access token and try again later.",
  geocodingFailedTitle: "Geocoding Failed",
  locationServicesDisabledTitle: "Location Services Disabled",
  locationServicesDisabledMessage:
    "Please enable location services on your device to use this feature.",
  locationUnavailableTitle: "Location Unavailable",
  locationUnavailableMessage:
    "Could not fetch your location. Make sure location services are enabled on your device.",
  unexpectedErrorTitle: "Unexpected Error",
  unexpectedErrorMessage:
    "An unexpected error occurred while getting your location.",
  cameraUnavailableMessage:
    "Camera is not available on this device/simulator. Please use gallery instead.",
  imagePickerFailedMessage:
    "Could not open camera or image library. Please try again.",
  permissionRefreshFailedMessage:
    "Could not refresh permission status. Please try again.",
  openSettingsFailedMessage: "Unable to open device settings.",
  dbInitFailed: "Database initialization failed.",
  openSettings: "Open Settings",
  permissionsDeniedPermanently:
    " To enable it, go to your device settings and allow access for this app.",
} as const;
