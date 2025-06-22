import { VariableExpense } from "@/types/types";

type Props = {
  expenses: VariableExpense[];
  name?: boolean;
  amountLeft?: boolean;
  limit?: boolean;
};

export function sortedExpenses({
  expenses,
  name,
  amountLeft,
  limit,
}: Props): VariableExpense[] {
  const under = expenses.filter((e) => e.spent < e.limit);
  const over = expenses.filter((e) => e.spent >= e.limit);

  if (name) {
    under.sort((a, b) => a.name.localeCompare(b.name));
  } else if (amountLeft) {
    under.sort((a, b) => a.limit - a.spent - (b.limit - b.spent));
  } else if (limit) {
    under.sort((a, b) => a.limit - b.limit);
  }

  return [...under, ...over];
}
