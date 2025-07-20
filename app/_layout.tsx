import { RealmProvider } from "@realm/react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";

import Snackbar from "@/components/Snackbar";
import { Colors } from "@/constants/Colors";
import { SnackbarProvider } from "@/hooks/useSnackbar";
import { Month } from "@/realm/models/Month";
import { VariableExpense } from "@/realm/models/VariableExpense";
import { SafeAreaView } from "react-native";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardProvider>
        <SnackbarProvider>
          <RealmProvider
            schema={[VariableExpense, Month]}
            path="myrealm.realm"
            schemaVersion={2}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
            <Snackbar />
          </RealmProvider>
        </SnackbarProvider>
      </KeyboardProvider>
    </SafeAreaView>
  );
}
