import { GraphQLError } from "graphql";
import { z } from "zod";
import cryptr from "../helper/cryptr";
import ErrorHandler from "../helper/errorHandler";
import db from "../models";
import type { Context } from "../../typing";

const ArgsSchema = z.object({
  input: z.object({
    amount: z.number(),
    description: z.string().nullable(),
  }),
});
type Args = z.infer<typeof ArgsSchema>;

const depositTransaction = async (root: any, args: Args, context: Context) => {
  try {
    ArgsSchema.parse(args);
    const { amount, description } = args.input;
    const { user } = context;

    if (!user) throw new GraphQLError("Invalid credentials");

    if (amount > 10000) throw new GraphQLError("Can only deposit ₦10000 and below at once");
    
    const balanceAtCompletion = Number(user.balance) + amount;

    const name = user.firstName + " " + user.lastName;

    const transaction = await db.transactionModel.create({
      amount,
      description,
      receiverId: user.id,
      senderId: user.id,
      balanceAtCompletion,
      status: "completed",
      senderName: name,
      receiverName: name,
      type: "Deposit",
    });

    if (!transaction) throw new GraphQLError("Something went wrong");
    

    const userBalance = await encryptBalance(
      `${balanceAtCompletion}`,
      user.email + "." + Number(user.phoneNumber)
    );

    await db.userModel.updateOne({ _id: user.id }, { balance: userBalance });

    return { message: "Transaction deposit successfully" };
  } catch (error) {
    ErrorHandler(error);
  }
};

export const encryptBalance = async (amount: string, passphrase: string) => {
  const newCryptr = await cryptr(passphrase);

  const balance = newCryptr.encrypt(amount);

  return balance;
};
export default depositTransaction;
