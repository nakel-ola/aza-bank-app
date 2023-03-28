import { Schema, SchemaTypes, model } from "mongoose";

const transactionModel = new Schema(
  {
    amount: {
      type: SchemaTypes.Number,
      required: true,
    },
    description: {
      type: SchemaTypes.String,
      required: false,
    },
    receiverId: {
      type: SchemaTypes.String,
      required: true,
    },
    senderId: {
      type: SchemaTypes.String,
      required: true,
    },
    senderName: {
      type: SchemaTypes.String,
      required: true,
    },
    receiverName: {
      type: SchemaTypes.String,
      required: true,
    },
    type: {
      type: SchemaTypes.String,
      required: true,
    },
    balanceAtCompletion: {
      type: SchemaTypes.Number,
      required: false,
    },
    status: {
      type: SchemaTypes.String,
      required: false,
    },
  },
  { timestamps: true }
);

export default model("transactions", transactionModel);
