// components/ExpenseInputModal.tsx

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

const screenHeight = Dimensions.get("window").height;
const CARD_HEIGHT = 160;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, limit: number) => void;
}

export default function ExpenseInputModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const nameRef = useRef<TextInput>(null);
  const limitRef = useRef<TextInput>(null);

  const keyboardHeight = useKeyboardHeight();
  const offset = useSharedValue(-CARD_HEIGHT);

  // slide the card whenever the keyboard height changes or visibility toggles
  useEffect(() => {
    offset.value = withTiming(visible ? keyboardHeight + 5 : -CARD_HEIGHT, {
      duration: 200,
    });
    if (!visible) {
      setName("");
      setLimit("");
    }
  }, [visible, keyboardHeight]);

  // only when visibility *becomes* true, focus the name input
  useEffect(() => {
    if (visible) {
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [visible]);

  const handleSubmit = () => {
    const parsedLimit = parseFloat(limit);
    if (name.trim() && !isNaN(parsedLimit)) {
      onSubmit(name.trim(), parsedLimit);
      onClose();
    }
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
        <Text style={styles.title}>Add New Expense</Text>
        <View style={styles.row}>
          <TextInput
            ref={nameRef}
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Expense name"
            placeholderTextColor="#888"
            returnKeyType="next"
            maxLength={28}
            onSubmitEditing={() => limitRef.current?.focus()}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            ref={limitRef}
            style={styles.input}
            value={limit}
            onChangeText={(text) => setLimit(sanitizeCurrencyInput(text))}
            keyboardType="decimal-pad"
            placeholder="Budget limit"
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
    bottom: -CARD_HEIGHT,
    height: CARD_HEIGHT,
    width: "95%",
    alignSelf: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
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
