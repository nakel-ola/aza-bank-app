import { z } from "zod";
import ErrorHandler from "../helper/errorHandler";
import db from "../models";

const ArgsSchema = z.object({
  input: z.object({
    email: z.string().email("Invalid Email"),
    validationToken: z
      .number()
      .min(5, "Validation token must be 5 characters")
      .max(5, "Validation token must be 5 characters"),
  }),
});

type Args = Required<z.infer<typeof ArgsSchema>>;

const validateCode = async (root: any, args: Args) => {
  try {
    ArgsSchema.parse(args);
    const validate = await db.validateModel.findOne(args.input);

    if (!validate) return { validate: false };

    return { validate: true };
  } catch (error) {
    ErrorHandler(error);
  }
};

export default validateCode;
