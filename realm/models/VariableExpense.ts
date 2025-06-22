import { Realm } from "realm";

export class VariableExpense extends Realm.Object<VariableExpense> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  limit!: number;
  spent!: number;

  static schema: Realm.ObjectSchema = {
    name: "VariableExpense",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      name: "string",
      limit: "double",
      spent: "double",
    },
  };
}
