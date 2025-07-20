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
    withSpring
} from "react-native-reanimated";

const { height: screenHeight } = Dimensions.get("window");
const CARD_HEIGHT = 250;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, limit: number) => void;
}

export default function EnterVEModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const [categoryName, setCategoryName] = useState("");
  const [limitValue, setLimitValue] = useState("");
  const nameInputRef = useRef<TextInput>(null);
  const limitInputRef = useRef<TextInput>(null);
  const keyboardTimeoutRef = useRef<number | null>(null);

  const keyboardHeight = useKeyboardHeight();
  const offset = useSharedValue(-CARD_HEIGHT);

  // Handle keyboard height changes with debouncing
  useEffect(() => {
    if (!visible) return;
    
    // Clear any existing timeout
    if (keyboardTimeoutRef.current) {
      clearTimeout(keyboardTimeoutRef.current);
    }
    
    // Wait for keyboard to stabilize before animating
    keyboardTimeoutRef.current = setTimeout(() => {
        offset.value = withSpring(keyboardHeight + 5, { mass: 1, damping: 28 , stiffness: 350});
    }, 0);
    
    return () => {
      if (keyboardTimeoutRef.current) {
        clearTimeout(keyboardTimeoutRef.current);
      }
    };
  }, [keyboardHeight, visible]);

  useEffect(() => {
    if (visible) {
      // Focus input immediately when modal becomes visible
      setTimeout(() => nameInputRef.current?.focus(), 1);
    } else {
      offset.value = withSpring(-CARD_HEIGHT, { mass: 1, damping: 28 , stiffness: 350});
      setCategoryName("");
      setLimitValue("");
      // Clear any pending keyboard timeout
      if (keyboardTimeoutRef.current) {
        clearTimeout(keyboardTimeoutRef.current);
      }
    }
  }, [visible]);

  const handleSubmit = () => {
    const name = categoryName.trim();
    const limit = parseFloat(limitValue);
    
    if (name && !isNaN(limit) && limit > 0) {
      onSubmit(name, limit);
      onClose();
    }
  };

  const canSubmit = categoryName.trim() && limitValue && parseFloat(limitValue) > 0;

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
        <Text style={styles.title}>Add Budget Category</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            ref={nameInputRef}
            style={styles.input}
            value={categoryName}
            onChangeText={setCategoryName}
            placeholder="Category name (e.g., Groceries)"
            placeholderTextColor={Colors.textSecondary}
            returnKeyType="next"
            onSubmitEditing={() => limitInputRef.current?.focus()}
          />
          
          <TextInput
            ref={limitInputRef}
            style={styles.input}
            value={limitValue}
            onChangeText={(text) => setLimitValue(sanitizeCurrencyInput(text))}
            keyboardType="decimal-pad"
            placeholder="Monthly budget (e.g., 400)"
            placeholderTextColor={Colors.textSecondary}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.addButton, !canSubmit && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Text style={[styles.addButtonText, !canSubmit && styles.disabledButtonText]}>
              Add Category
            </Text>
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
    backgroundColor: Colors.dark3,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    gap: 12,
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.background,
    color: Colors.text,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.dark4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButton: {
    flex: 1,
    backgroundColor: Colors.buttonGreen,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: Colors.textTertiary,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "500",
  },
  addButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: Colors.textSecondary,
  },
}); 