import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PageView({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.background, padding: 10 }}
      edges={["bottom", "left", "right"]}
    >
      {children}
    </SafeAreaView>
  );
}
