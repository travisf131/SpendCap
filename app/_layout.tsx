import { RealmProvider } from "@realm/react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Colors } from "@/constants/Colors";
import { VariableExpense } from "@/realm/models/VariableExpense";
import { getOrCreateCurrentMonth } from "@/services/month";
import { SafeAreaView } from "react-native";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  getOrCreateCurrentMonth();

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <RealmProvider
        schema={[VariableExpense]}
        path="myrealm.realm"
        schemaVersion={1}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </RealmProvider>
    </SafeAreaView>
  );
}
