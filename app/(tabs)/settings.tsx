import PageView from "@/components/PageView";
import { Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <PageView>
      <View style={{ alignSelf: "center", marginTop: "50%" }}>
        <Text style={{ color: "#fff" }}>SETTINGS</Text>
      </View>
    </PageView>
  );
}
