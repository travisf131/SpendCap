import PageView from "@/components/PageView";
import { exportRealmFile } from "@/utils/exportRealmFile";
import { Button, Text, View } from "react-native";

export default function AnalyticsScreen() {
  return (
    <PageView>
      <View style={{ alignSelf: "center", marginTop: "50%" }}>
        <Text style={{ color: "#fff" }}>
          You will see analytics here as you use the app.
          <Button title="Export Realm DB" onPress={exportRealmFile} />
        </Text>
      </View>
    </PageView>
  );
}
