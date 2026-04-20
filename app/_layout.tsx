import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import IconButton from "@/components/UI/IconButton";
import { Colors } from "@/constants/colors";
import { init } from "@/util/database";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setDbInitialized(true);
      })
      .catch((error) => {
        console.log("Initializing db failed.");
        console.log(error);
        setDbError(true);
      })
      .finally(() => {
        SplashScreen.hideAsync();
      });
  }, []);

  if (dbError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Failed to initialize the database. Please restart the app.</Text>
      </View>
    );
  }

  if (!dbInitialized) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary500 },
          headerTintColor: Colors.gray700,
          headerBackTitle: "Back",
          contentStyle: { backgroundColor: Colors.primary50 },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Your Favorite Places",
            headerRight: ({ tintColor }) => (
              <IconButton
                icon="add"
                size={24}
                color={tintColor}
                onClick={() => router.navigate("/AddPlace")}
              />
            ),
          }}
        />
        <Stack.Screen name="AddPlace" options={{ title: "Add a new place" }} />
        <Stack.Screen name="Map" options={{ title: "Map" }} />
        <Stack.Screen
          name="PlaceDetails"
          options={{ title: "Loading Place" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );}
