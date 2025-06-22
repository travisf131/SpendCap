// hooks/useVariableExpense.ts
import { MoveMoneyData } from "@/types/types";
import { getMonthIdString } from "@/utils/dates";
import { useRealm } from "@realm/react";
import Realm from "realm";
const { ObjectId } = Realm.BSON;
type ObjID = Realm.BSON.ObjectId;

export function useVariableExpense() {
  const realm = useRealm();

  const create = ({ name, limit }: { name: string; limit: number }) => {
    const now = new Date();
    const monthId = getMonthIdString(); // e.g., "2024-10"

    let month = realm.objectForPrimaryKey("Month", monthId);

    const newExpense = realm.create("VariableExpense", {
      _id: new ObjectId(),
      name,
      limit,
      spent: 0,
    });

    month?.variableExpenses.push(newExpense);
  };

  const renameExpense = (id: ObjID, newName: string) => {
    const obj = realm.objectForPrimaryKey("VariableExpense", id);
    if (!obj) return;
    realm.write(() => {
      obj.name = newName;
    });
  };

  const changeLimit = (id: ObjID, newLimit: number) => {
    const obj = realm.objectForPrimaryKey("VariableExpense", id);
    if (!obj) return;
    realm.write(() => {
      obj.limit = newLimit;
    });
  };

  const addSpend = (id: ObjID, amount: number) => {
    const obj = realm.objectForPrimaryKey("VariableExpense", id);
    if (!obj) return;
    realm.write(() => {
      obj.spent += amount;
    });
  };

  const remove = (id: ObjID) => {
    const obj = realm.objectForPrimaryKey("VariableExpense", id);
    if (!obj) return;
    realm.write(() => {
      realm.delete(obj);
    });
  };

  const handleMoneyOverLimit = (data: MoveMoneyData) => {
    const from = realm.objectForPrimaryKey("VariableExpense", data.from);
    const to = realm.objectForPrimaryKey("VariableExpense", data.to);
    if (!from || !to) return;

    realm.write(() => {
      from.spent = from.limit;
      to.spent += data.amount;
    });
  };

  const transfer = (data: MoveMoneyData) => {
    const from = realm.objectForPrimaryKey("VariableExpense", data.from);
    const to = realm.objectForPrimaryKey("VariableExpense", data.to);
    if (!from || !to) return;

    const fromBefore = from.spent;
    const toBefore = to.spent;

    realm.write(() => {
      from.spent += data.amount;
      to.spent -= data.amount;
    });

    console.log(`[Money Transfer]`);
    console.log(`→ Moved $${data.amount} from "${from.name}" to "${to.name}"`);
    console.log(`→ From "${from.name}": ${fromBefore} → ${from.spent}`);
    console.log(`→ To   "${to.name}": ${toBefore} → ${to.spent}`);
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
