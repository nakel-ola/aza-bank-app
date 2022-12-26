import { GraphQLError } from "graphql";
import { z } from "zod";
import type { Context } from "../../typing";
import ErrorHandler from "../helper/errorHandler";
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

    if (!user) {
      throw new GraphQLError("Invalid credentials");
    }

    const page = args.input?.page ?? 1,
      limit = args.input?.limit ?? 10,
      start = (page - 1) * limit,
      end = limit + start;

    const transaction = await db.transactionModel.find({
      $or: [{ senderId: user.id }, { receiverId: user.id }],
    });

    return {
      page,
      totalItems: transaction.length,
      results: transaction.slice(start, end),
    };
  } catch (error: any) {
    ErrorHandler(error);
  }
};

export default transactions;
