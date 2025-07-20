// components/Icon.tsx
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, TextStyle } from "react-native";

type Props = {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  size?: number;
  color?: string;
  style?: TextStyle;
  onPress?: () => void;
};

export default function Icon({
  name,
  size = 24,
  color = "white",
  onPress,
  style,
}: Props) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <MaterialIcons
          name={name}
          size={size}
          color={pressed ? "#ccc" : color}
          style={[{ opacity: pressed ? 0.6 : 1 }, style]}
        />
      )}
    </Pressable>
  );
}
