import { Schema, SchemaTypes, model } from "mongoose";

const userModel = new Schema(
  {
    email: {
      type: SchemaTypes.String,
      required: true,
    },
    firstName: {
      type: SchemaTypes.String,
      required: true,
    },
    lastName: {
      type: SchemaTypes.String,
      required: true,
    },
    balance: {
      type: SchemaTypes.String,
      required: true,
    },
    password: {
      type: SchemaTypes.String,
      required: true,
    },
    phoneNumber: {
      type: SchemaTypes.String,
      required: true,
    },
    accountNumber: {
      type: SchemaTypes.Number,
      required: true,
    },
    photoUrl: {
      type: SchemaTypes.String,
      required: false,
    },
  },
  { timestamps: true }
);

export default model("users", userModel);
