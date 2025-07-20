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
  const { getOrCreateCurrentMonth } = useMonth();

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
    realm.write(() => {
      obj.limit = newLimit;
    });
  };

  const addSpend = (id: ObjID, amount: number) => {
    const obj = realm.objectForPrimaryKey(VariableExpense, id);
    if (!obj) return;
    realm.write(() => {
      obj.spent += amount;
    });
  };

  const remove = (id: ObjID) => {
    const obj = realm.objectForPrimaryKey(VariableExpense, id);
    if (!obj) return;
    realm.write(() => {
      realm.delete(obj);
    });
  };

  const handleMoneyOverLimit = (data: MoveMoneyData) => {
    const from = realm.objectForPrimaryKey(VariableExpense, data.from);
    const to = realm.objectForPrimaryKey(VariableExpense, data.to);
    if (!from || !to) return;

    realm.write(() => {
      from.spent = from.limit;
      to.spent += data.amount;
    });
  };

  const transfer = (data: MoveMoneyData) => {
    const from = realm.objectForPrimaryKey(VariableExpense, data.from);
    const to = realm.objectForPrimaryKey(VariableExpense, data.to);
    if (!from || !to) return;

    realm.write(() => {
      from.spent += data.amount;
      to.spent -= data.amount;
    });
  };

  return {
    create,
    addSpend,
    transfer,
    changeLimit,
    renameExpense,
    handleMoneyOverLimit,
    remove,
  };
}
