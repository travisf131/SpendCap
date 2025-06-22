// components/Icon.tsx

import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  size?: number;
  color?: string;
};

export default function Icon({ name, size = 24, color = "white" }: Props) {
  return <MaterialIcons name={name} size={size} color={color} />;
}
