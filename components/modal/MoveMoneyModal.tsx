import { Colors } from "@/constants/Colors";
import { useMonth } from "@/services/month";
import type {
  MoveMoneyData,
  VariableExpense as VariableExpenseType,
} from "@/types/types";
import { sanitizeCurrencyInput } from "@/utils/sanitzeCurrencyInput";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Keyboard,
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
import RemainingBar from "../RemainingBar";

const { height: screenHeight } = Dimensions.get("window");
const CARD_HEIGHT = 400;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: MoveMoneyData) => void;
  from: VariableExpenseType;
}

export default function MoveMoneyModal({
  visible,
  onClose,
  onSubmit,
  from,
}: Props) {
  const { getOrCreateCurrentMonth } = useMonth();
  const currentMonth = getOrCreateCurrentMonth();
  
  // Get only VEs from current month that have available space (spent < limit)
  const available = currentMonth.variableExpenses.filter(ve => ve.spent < ve.limit);
  
  const offset = useSharedValue(-CARD_HEIGHT);
  const amountToMoveRef = useRef<TextInput>(null);
  const [amountToMove, setAmountToMove] = useState<string>("");
  const [showToOptions, setShowToOptions] = useState(false);

  useEffect(() => {
    offset.value = withTiming(visible ? 5 : -CARD_HEIGHT, { duration: 200 });
    if (visible) amountToMoveRef.current?.focus();
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    bottom: offset.value,
  }));

  const handlePick = (to: VariableExpenseType) => {
    Keyboard.dismiss();
    onSubmit({
      from: from._id,
      to: to._id,
      amount: parseFloat(parseFloat(amountToMove).toFixed(2)),
    });
    close();
  };

  const close = () => {
    onClose();
    setShowToOptions(false);
    setAmountToMove("");
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={close}
    >
      <TouchableOpacity
        style={styles.backdrop}
        onPress={close}
        activeOpacity={1}
      />
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.title}>
          {`Move money from`}{" "}
          <Text style={[styles.title, { fontWeight: "600" }]}>{from.name}</Text>{" "}
          {`to another category`}
        </Text>
        {showToOptions && (
          <Text style={styles.subtitle}>
            {`Where would you like to move $${amountToMove} to?`}
          </Text>
        )}

        {!showToOptions && (
          <View style={styles.row}>
            <TextInput
              onFocus={() => amountToMoveRef.current?.focus()}
              ref={amountToMoveRef}
              style={styles.input}
              value={amountToMove}
              onChangeText={(text) =>
                setAmountToMove(sanitizeCurrencyInput(text))
              }
              keyboardType="decimal-pad"
              placeholder="Amount to move"
              placeholderTextColor="#888"
              returnKeyType="done"
              onSubmitEditing={() => {
                setShowToOptions(true);
              }}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setShowToOptions(true);
                Keyboard.dismiss();
              }}
            >
              <Text style={styles.buttonText}>Move</Text>
            </TouchableOpacity>
          </View>
        )}

        {showToOptions && (
          <FlatList
            data={available}
            keyExtractor={(item) => item._id.toString()}
            style={styles.list}
            renderItem={({ item }) => {
              const remaining = item.limit - item.spent;
              return (
                <TouchableOpacity
                  style={[styles.item, { backgroundColor: Colors.background }]}
                  onPress={() => handlePick(item)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        { fontWeight: "bold", color: Colors.text },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text style={styles.itemText}>${remaining} left</Text>
                  </View>
                  <RemainingBar left={remaining} total={item.limit} />
                </TouchableOpacity>
              );
            }}
          />
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  card: {
    width: "90%",
    top: "25%",
    maxHeight: CARD_HEIGHT,
    alignSelf: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    justifyContent: "flex-start",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 25,
    marginTop: 5,
  },
  list: {
    flexGrow: 0,
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 20,
  },
  itemText: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 1,
    alignSelf: "center",
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
