import { GraphQLError } from "graphql";
import { z } from "zod";
import type { Context } from "../../typing";
import ErrorHandler from "../helper/errorHandler";
import clean from "../helper/clean";
import db from "../models";

const ArgsSchema = z.object({
  input: z.object({
    page: z.number().int(),
    limit: z.number().int(),
  }),
});

type Args = z.infer<typeof ArgsSchema>;

const transactions = async (root: any, args: Args, context: Context) => {
  try {
    ArgsSchema.parse(args);
    const { user } = context;

    if (!user) throw new GraphQLError("Invalid credentials");

    const page = args.input?.page ?? 1,
      limit = args.input?.limit ?? 10,
      start = (page - 1) * limit;

    const filter = {
      $or: [{ senderId: user.id }, { receiverId: user.id }],
    };

    const transactions = await db.transactionModel.find(filter, null, {
      limit,
      skip: start,
    });

    const totalItems = await db.transactionModel.count(filter);

    return {
      page,
      totalItems,
      results: transactions,
    };
  } catch (error: any) {
    ErrorHandler(error);
  }
};

export default transactions;
