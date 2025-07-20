import { Colors } from "@/constants/Colors";
import { useMonth } from "@/services/month";
import type {
    MoveMoneyData,
    VariableExpense as VariableExpenseType,
} from "@/types/types";
import React, { useEffect } from "react";
import {
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    Text,
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
  amountToMove: number;
  sourceExpense: VariableExpenseType;
}

export default function MoneyOverLimitModal({
  visible,
  onClose,
  onSubmit,
  amountToMove,
  sourceExpense,
}: Props) {
  const { getOrCreateCurrentMonth } = useMonth();
  const currentMonth = getOrCreateCurrentMonth();
  
  // Get only VEs from current month that have available space (spent < limit)
  const available = currentMonth.variableExpenses.filter(ve => ve.spent < ve.limit);
  
  const offset = useSharedValue(-CARD_HEIGHT);

  useEffect(() => {
    offset.value = withTiming(visible ? 5 : -CARD_HEIGHT, { duration: 200 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    bottom: offset.value,
  }));

  const handlePick = (target: VariableExpenseType) => {
    onSubmit({
      from: sourceExpense._id,
      to: target._id,
      amount: amountToMove,
    });
    onClose();
  };

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
        <Text style={styles.title}>
          {`You went over budget by $${amountToMove}.`}
        </Text>
        <Text style={styles.subtitle}>
          {`Which category would you like to pull $${amountToMove} from?`}
        </Text>

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
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
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
  itemText: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 1,
    alignSelf: "center",
  },
});
