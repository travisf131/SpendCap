import ExpenseInputModal from "@/components/modal/CreateExpenseModal";
import MoneyOverLimitModal from "@/components/modal/MoneyOverLimitModal";
import MoveMoneyModal from "@/components/modal/MoveMoneyModal";
import TransactionInputModal from "@/components/modal/TransactionInputModal";
import PageView from "@/components/PageView";
import { ThemedText } from "@/components/ThemedText";
import PressableIcon from "@/components/ui/PressableIcon";
import VariableExpenseCard from "@/components/VariableExpenseCard";
import { useVariableExpense } from "@/hooks/realm/useVariableExpense";
import { VariableExpense } from "@/realm/models/VariableExpense";
import type { VariableExpense as VariableExpenseType } from "@/types/types";
import { getCurrentMonthYear } from "@/utils/getCurrentMonthYear";
import { sortedExpenses } from "@/utils/sortExpenses";
import { useQuery } from "@realm/react";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { View, ViewStyle } from "react-native";

export default function HomeScreen() {
  const expenses = useQuery(VariableExpense);
  const expensesSorted = sortedExpenses({ expenses: [...expenses] });
  const { create, addSpend, remove, handleMoneyOverLimit, transfer } =
    useVariableExpense();

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [createExpenseModal, setCreateExpenseModal] = useState(false);
  const [moveMoneyModal, setMoveMoneyModal] = useState(false);
  const [moveMoneyFrom, setMoveMoneyFrom] = useState<VariableExpenseType>();
  const [overLimit, setOverLimit] = useState<{
    showModal: boolean;
    amountToMove: number | null;
    sourceExpense: VariableExpenseType | null | undefined;
  }>({
    showModal: false,
    amountToMove: null,
    sourceExpense: null,
  });
  const [expenseToEdit, setExpenseToEdit] =
    useState<VariableExpenseType | null>();

  const handleOverLimit = (amountOver: number) => {
    // take the amount exceeded away from another category
    setOverLimit({
      showModal: true,
      amountToMove: amountOver,
      sourceExpense: expenseToEdit,
    });
  };

  return (
    <PageView>
      <View style={header}>
        <ThemedText type="title">{getCurrentMonthYear()}</ThemedText>
        <PressableIcon name="add" onPress={() => setCreateExpenseModal(true)} />
      </View>

      <FlashList
        data={expensesSorted}
        estimatedItemSize={100}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <VariableExpenseCard
            expense={item}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              setExpenseToEdit(item);
              setShowTransactionModal(true);
            }}
            onLongPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              setMoveMoneyFrom(item);
              setMoveMoneyModal(true);
            }}
          />
        )}
      />

      <TransactionInputModal
        visible={showTransactionModal}
        expenseName={expenseToEdit?.name}
        onSubmit={(amount: number) => {
          if (expenseToEdit) {
            // check if this add went over the limit for that category
            const spent = expenseToEdit.spent + amount;
            const limit = expenseToEdit.limit;
            const amountOver = spent - limit;
            if (spent > limit) {
              handleOverLimit(amountOver);
            }

            addSpend(expenseToEdit._id, amount);
          }
        }}
        onClose={() => {
          setShowTransactionModal(false);
          setExpenseToEdit(null);
        }}
      />

      <ExpenseInputModal
        visible={createExpenseModal}
        onClose={() => setCreateExpenseModal(false)}
        onSubmit={(name, limit) => {
          create({ name: name, limit: limit });
        }}
      />

      {overLimit.amountToMove && overLimit.sourceExpense && (
        <MoneyOverLimitModal
          visible={true}
          amountToMove={overLimit.amountToMove}
          sourceExpense={overLimit.sourceExpense}
          onClose={() => null}
          onSubmit={(data) => {
            handleMoneyOverLimit(data);
            setOverLimit({
              showModal: false,
              amountToMove: null,
              sourceExpense: null,
            });
          }}
        />
      )}

      {moveMoneyFrom && (
        <MoveMoneyModal
          visible={moveMoneyModal}
          onClose={() => setMoveMoneyModal(false)}
          from={moveMoneyFrom}
          onSubmit={(data) => {
            transfer(data);
          }}
        />
      )}
    </PageView>
  );
}

const header: ViewStyle = {
  marginBottom: 10,
  marginTop: 2,
  paddingHorizontal: 5,
  flexDirection: "row",
  justifyContent: "space-between",
};
