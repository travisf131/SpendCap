// hooks/useVariableExpense.ts
import { VariableExpense } from "@/realm/models/VariableExpense";
import { useMonth } from "@/services/month";
import { MoveMoneyData } from "@/types/types";
import { useRealm } from "@realm/react";
import Realm from "realm";
const { ObjectId } = Realm.BSON;
type ObjID = Realm.BSON.ObjectId;

export function useVariableExpense() {
  const realm = useRealm();
  const { getOrCreateCurrentMonth, updateMonthlySavings } = useMonth();

  const create = ({ name, limit }: { name: string; limit: number }) => {
    const month = getOrCreateCurrentMonth();

    realm.write(() => {
      const newExpense = realm.create(VariableExpense, {
        _id: new ObjectId(),
        name,
        limit,
        spent: 0,
      });

      month.variableExpenses.push(newExpense);
    });
    
    // Update monthly savings after adding new category
    updateMonthlySavings(month.monthId);
  };

  const renameExpense = (id: ObjID, newName: string) => {
    const obj = realm.objectForPrimaryKey(VariableExpense, id);
    if (!obj) return;
    realm.write(() => {
      obj.name = newName;
    });
  };

  const changeLimit = (id: ObjID, newLimit: number) => {
    const obj = realm.objectForPrimaryKey(VariableExpense, id);
    if (!obj) return;
    const month = getOrCreateCurrentMonth();
    realm.write(() => {
      obj.limit = newLimit;
    });
    
    // Update monthly savings after changing limit
    updateMonthlySavings(month.monthId);
  };

  const addSpend = (id: ObjID, amount: number) => {
    const obj = realm.objectForPrimaryKey(VariableExpense, id);
    if (!obj) return;
    const month = getOrCreateCurrentMonth();
    realm.write(() => {
      obj.spent += amount;
    });
    
    // Update monthly savings after spending
    updateMonthlySavings(month.monthId);
  };

  const remove = (id: ObjID) => {
    const obj = realm.objectForPrimaryKey(VariableExpense, id);
    if (!obj) return;
    const month = getOrCreateCurrentMonth();
    realm.write(() => {
      realm.delete(obj);
    });
    
    // Update monthly savings after removing category
    updateMonthlySavings(month.monthId);
  };

  const handleMoneyOverLimit = (data: MoveMoneyData) => {
    const from = realm.objectForPrimaryKey(VariableExpense, data.from);
    const to = realm.objectForPrimaryKey(VariableExpense, data.to);
    if (!from || !to) return;
    const month = getOrCreateCurrentMonth();

    realm.write(() => {
      from.spent = from.limit;
      to.spent += data.amount;
    });
    
    // Update monthly savings after moving money
    updateMonthlySavings(month.monthId);
  };

  const transfer = (data: MoveMoneyData) => {
    const from = realm.objectForPrimaryKey(VariableExpense, data.from);
    const to = realm.objectForPrimaryKey(VariableExpense, data.to);
    if (!from || !to) return;
    const month = getOrCreateCurrentMonth();

    realm.write(() => {
      from.spent += data.amount;
      to.spent -= data.amount;
    });
    
    // Update monthly savings after transfer
    updateMonthlySavings(month.monthId);
  };

  const deductFromMonthlySavings = (veId: ObjID, amount: number) => {
    const ve = realm.objectForPrimaryKey(VariableExpense, veId);
    if (!ve) return;
    const month = getOrCreateCurrentMonth();

    realm.write(() => {
      // Set the VE spent to its limit (max it can go)
      ve.spent = ve.limit;
      // Deduct the overage from monthly savings
      month.monthlySavings = Math.max(0, month.monthlySavings - amount);
    });
  };

  return {
    create,
    addSpend,
    transfer,
    changeLimit,
    renameExpense,
    handleMoneyOverLimit,
    deductFromMonthlySavings,
    remove,
  };
}
