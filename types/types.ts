import { BSON } from "realm";

export type VariableExpense = {
  _id: BSON.ObjectId;
  name: string;
  limit: number;
  spent: number;
};

export type Expense = {
  name: string;
  limit: number;
  spent: number;
};

export type MoveMoneyData = {
  from: BSON.ObjectId;
  to: BSON.ObjectId;
  amount: number;
};

export type MonthType = {
  _id: BSON.ObjectId;
  income: number;
  fixedExpenses: number;
  savingsGoal: number;
  notes: string;
  variableExpenses: Realm.List<VariableExpense>;
};
