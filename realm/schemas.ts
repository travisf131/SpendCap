export const VariableExpenseSchema = {
  name: "VariableExpense",
  properties: {
    _id: "objectId",
    name: "string",
    limit: "double",
    spent: "double",
  },
  primaryKey: "_id",
};

export const MonthSchema = {
  name: "Month",
  properties: {
    monthId: "string", // e.g. "2025-07" - primary key
    income: "double",
    fixedExpenses: "double",
    savingsGoal: "double",
    notes: "string",
    variableExpenses: {
      type: "list",
      objectType: "VariableExpense",
    },
  },
  primaryKey: "monthId",
};
