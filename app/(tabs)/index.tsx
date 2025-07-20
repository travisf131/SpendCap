import ExpenseInputModal from "@/components/modal/CreateExpenseModal";
import MoneyOverLimitModal from "@/components/modal/MoneyOverLimitModal";
import MoveMoneyModal from "@/components/modal/MoveMoneyModal";
import TransactionInputModal from "@/components/modal/TransactionInputModal";
import PageView from "@/components/PageView";
import { ThemedText } from "@/components/ThemedText";
import VariableExpenseCard from "@/components/VariableExpenseCard";
import { Colors } from "@/constants/Colors";
import { useVariableExpense } from "@/hooks/realm/useVariableExpense";
import { useCurrency } from "@/hooks/useCurrency";
import { useSettings } from "@/hooks/useSettings";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useMonth } from "@/services/month";
import type { VariableExpense as VariableExpenseType } from "@/types/types";
import { getCurrentMonthYear, getMonthYearFromId } from "@/utils/getCurrentMonthYear";
import { sortedExpenses } from "@/utils/sortExpenses";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

export default function HomeScreen() {
  const { getCurrentMonthWithTransition } = useMonth();
  const { showSnackbar } = useSnackbar();
  const { create, addSpend, remove, handleMoneyOverLimit, transfer } =
    useVariableExpense();

  const { getSettings } = useSettings();
  const settings = getSettings();
  const { formatAmount } = useCurrency();

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

  // Get current month with automatic transition detection
  const { month: currentMonth, transitioned } = getCurrentMonthWithTransition();
  const expenses = currentMonth.variableExpenses;
  const expensesSorted = sortedExpenses({ expenses: [...expenses] });

  // Show notification when month transitions
  useEffect(() => {
    if (transitioned) {
      const monthName = getMonthYearFromId(currentMonth.monthId);
      showSnackbar(`Welcome to ${monthName}! New month created with your settings.`, 'success');
    }
  }, [transitioned, showSnackbar]);

  const handleOverLimit = (amountOver: number) => {
    // take the amount exceeded away from another category
    setOverLimit({
      showModal: true,
      amountToMove: amountOver,
      sourceExpense: expenseToEdit || undefined,
    });
  };

  // Calculate projected savings for current month
  const totalVEBudget = expenses.reduce((sum, ve) => sum + ve.limit, 0);
  const projectedSavings = currentMonth.income - currentMonth.fixedExpenses - totalVEBudget;

  return (
    <PageView>
      <View style={header}>
        <ThemedText style={{ fontSize: 28}} type="title">{getCurrentMonthYear()}</ThemedText>
      </View>

      {expensesSorted.length > 0 && currentMonth.income > 0 && currentMonth.fixedExpenses > 0 ? (
        <>
          {/* Projected Savings Display */}
          <View style={savingsContainer}>
            <ThemedText style={savingsLabel}>Projected Savings:</ThemedText>
            <ThemedText style={[
              savingsAmount,
              projectedSavings < 0 ? negativeSavings : positiveSavings
            ]}>
              {formatAmount(projectedSavings)}
            </ThemedText>
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
        </>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 0 }}>
          <TouchableOpacity
            onPress={() => router.push('/settings/financial')}
            style={{
              backgroundColor: Colors.dark3,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: Colors.buttonGreen,
            }}
          >
            <ThemedText style={{ color: Colors.text }}>{'Add Income, Budget & Expenses'}</ThemedText>
          </TouchableOpacity>
        </View>
      )}

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
          from={moveMoneyFrom}
          onClose={() => setMoveMoneyModal(false)}
          onSubmit={(data) => {
            transfer(data);
            setMoveMoneyModal(false);
          }}
        />
      )}
    </PageView>
  );
}

const header: ViewStyle = {
  marginBottom: 12,
  marginTop: 2,
  paddingHorizontal: 5,
  flexDirection: "row",
  justifyContent: "space-between",
};

const savingsContainer: ViewStyle = {
  backgroundColor: Colors.dark3,
  padding: 16,
  borderRadius: 12,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
  marginHorizontal: 5,
};

const savingsLabel: TextStyle = {
  color: Colors.textSecondary,
  fontSize: 16,
  fontWeight: "500",
};

const savingsAmount: TextStyle = {
  fontSize: 18,
  fontWeight: "600",
};

const positiveSavings: TextStyle = {
  color: Colors.buttonGreen,
};

const negativeSavings: TextStyle = {
  color: Colors.colorCritical,
}; 