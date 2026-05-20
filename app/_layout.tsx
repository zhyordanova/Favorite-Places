import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import IconButton from "@/components/ui/IconButton";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Colors } from "@/constants/colors";
import { ALERT_MESSAGES } from "@/constants/messages";
import { PickedLocationProvider } from "@/store/picked-location-context";
import { init } from "@/util/database";

void SplashScreen.preventAutoHideAsync();

const stackScreenOptions = {
  headerStyle: { backgroundColor: Colors.primary500 },
  headerTintColor: Colors.gray700,
  headerBackTitle: "Back",
  contentStyle: { backgroundColor: Colors.primary50 },
};

export default function RootLayout() {
  const router = useRouter();

  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setDbInitialized(true);
      })
      .catch((error: unknown) => {
        console.error(ALERT_MESSAGES.dbInitFailed, error);
        setDbError(true);
      })
      .finally(() => {
        SplashScreen.hideAsync();
      });
  }, []);

  if (dbError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Failed to initialize the database. Please restart the app.</Text>
      </View>
    );
  }

  if (!dbInitialized) {
    return <LoadingOverlay message="Preparing app..." />;
  }

  return (
    <>
      <PickedLocationProvider>
        <Stack screenOptions={stackScreenOptions}>
          <Stack.Screen
            name="index"
            options={{
              title: "Your Favorite Places",
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon="add"
                  size={24}
                  color={tintColor}
                  onPress={() => router.navigate("/add-place")}
                />
              ),
            }}
          />

          <Stack.Screen
            name="add-place"
            options={{ title: "Add a new place" }}
          />
          <Stack.Screen name="map" options={{ title: "Map" }} />
          <Stack.Screen
            name="place-details"
            options={{ title: "Loading Place" }}
          />
        </Stack>
      </PickedLocationProvider>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
