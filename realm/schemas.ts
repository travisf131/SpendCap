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

export const Month = {
  name: "Month",
  properties: {
    _id: "objectId",
    monthId: "string", // e.g. 2025-07
    income: "double",
    fixedExpenses: "double",
    savingsGoal: "number",
    notes: "string",
    variableExpenses: {
      type: "list",
      objectType: "VariableExpense",
    },
  },
  primaryKey: "_id",
};
