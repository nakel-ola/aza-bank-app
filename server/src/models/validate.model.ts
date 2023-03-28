import { Schema, SchemaTypes, model } from "mongoose";

const validateModel = new Schema(
  {
    email: {
      type: SchemaTypes.String,
      required: true,
    },
    validationToken: {
      type: SchemaTypes.Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("validate", validateModel);
