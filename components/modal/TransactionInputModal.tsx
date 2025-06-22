// TransactionInputModal.tsx

import { Colors } from "@/constants/Colors";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { sanitizeCurrencyInput } from "@/utils/sanitzeCurrencyInput";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { height: screenHeight } = Dimensions.get("window");
const CARD_HEIGHT = 120;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  expenseName?: string;
}

export default function TransactionInputModal({
  visible,
  onClose,
  onSubmit,
  expenseName,
}: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<TextInput>(null);

  const keyboardHeight = useKeyboardHeight();
  const offset = useSharedValue(-CARD_HEIGHT);

  useEffect(() => {
    if (visible) {
      offset.value = withTiming(keyboardHeight + 5, { duration: 200 });
      setTimeout(() => inputRef.current?.focus(), 1);
    } else {
      offset.value = withTiming(-CARD_HEIGHT, { duration: 200 });
      setValue("");
    }
  }, [visible, keyboardHeight]);

  const handleSubmit = () => {
    const amount = parseFloat(value);
    if (!isNaN(amount)) {
      onSubmit(amount);
    }
    onClose();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    bottom: offset.value,
  }));

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
      />
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text
          style={styles.prompt}
        >{`How much did you spend on ${expenseName}?`}</Text>
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={(text) => setValue(sanitizeCurrencyInput(text))}
            keyboardType="decimal-pad"
            placeholder="$0.00"
            placeholderTextColor="#888"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  card: {
    position: "absolute",
    height: CARD_HEIGHT,
    width: "95%",
    alignSelf: "center",
    flexDirection: "column",
    backgroundColor: "#2A2A2A",
    marginBottom: 5,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    justifyContent: "flex-start",
  },
  prompt: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    marginTop: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingVertical: 4,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
