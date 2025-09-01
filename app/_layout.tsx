import { RealmProvider } from "@realm/react";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";

import AppWrapper from "@/components/AppWrapper";
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
            schemaVersion={3}
            onMigration={(oldRealm, newRealm) => {
              // Migration from schema version 2 to 3
              if (oldRealm.schemaVersion < 3) {
                const oldMonths = oldRealm.objects('Month');
                const newMonths = newRealm.objects('Month');
                
                for (let i = 0; i < oldMonths.length; i++) {
                  const oldMonth = oldMonths[i];
                  const newMonth = newMonths[i];
                  
                  // Calculate initial monthlySavings value based on existing data
                  const totalBudget = oldMonth.variableExpenses.reduce((sum: number, ve: any) => sum + ve.limit, 0);
                  const totalSpent = oldMonth.variableExpenses.reduce((sum: number, ve: any) => sum + ve.spent, 0);
                  const projectedSavings = oldMonth.income - oldMonth.fixedExpenses - totalBudget;
                  
                  // If user has spent over budget, reduce monthlySavings accordingly
                  if (totalSpent > totalBudget) {
                    const overspend = totalSpent - totalBudget;
                    newMonth.monthlySavings = Math.max(0, projectedSavings - overspend);
                  } else {
                    // If under/at budget, monthlySavings is the projected savings plus any unspent budget
                    const unspentBudget = totalBudget - totalSpent;
                    newMonth.monthlySavings = projectedSavings + unspentBudget;
                  }
                }
              }
            }}
          >
            <AppWrapper />
            <StatusBar style="auto" />
            <Snackbar />
          </RealmProvider>
        </SnackbarProvider>
      </KeyboardProvider>
    </SafeAreaView>
  );
}
