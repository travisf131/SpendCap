import { Realm } from "realm";
import { VariableExpense } from "./VariableExpense";

export class Month extends Realm.Object<Month> {
  monthId!: string; // e.g. "2024-10" - using this as primary key
  income!: number;
  fixedExpenses!: number;
  savingsGoal!: number;
  notes!: string;
  variableExpenses!: Realm.List<VariableExpense>;

  static schema: Realm.ObjectSchema = {
    name: "Month",
    primaryKey: "monthId",
    properties: {
      monthId: "string",
      income: "double",
      fixedExpenses: "double", 
      savingsGoal: "double",
      notes: "string",
      variableExpenses: {
        type: "list",
        objectType: "VariableExpense",
      },
    },
  };
} 