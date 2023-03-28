import { GraphQLError } from "graphql";
import { z } from "zod";
import type { Context } from "../../typing";
import cryptr from "../helper/cryptr";
import ErrorHandler from "../helper/errorHandler";
import db from "../models";
import { encryptBalance } from "./deposit-transaction";




const ArgsSchema = z.object({
  input: z.object({
    accountNumber: z
      .number()
      .min(9, "Phone number must be at least 9 characters")
      .max(11, "Phone number must be at least 11 characters or less"),
    accountName: z.string(),
    amount: z.number(),
    description: z.string().optional(),
  }),
});


type Args = z.infer<typeof ArgsSchema>;

const sendTransaction = async (root: any, args: Args, context: Context) => {
  try {
    ArgsSchema.parse(args);

    const { accountName, accountNumber, amount, description } = args.input;
    const { user } = context;

    if (!user) 
throw new GraphQLError("Invalid credentials");
    

    const canCreate = Number(user.balance) >= amount;

    if (!canCreate) 
throw new GraphQLError("Insufficient funds");
    

    if (accountNumber === user.accountNumber) throw new GraphQLError("You can't send money to yourself");
    

    const receiverUser = await db.userModel.findOne({
      accountNumber,
    });

    if (!receiverUser) throw new GraphQLError(
        'User with account number "' + accountNumber + '" not found'
      );
    

    if (
      !validateName(accountName, receiverUser.firstName, receiverUser.lastName)
    ) throw new GraphQLError(
        "User with account name " + accountName + " not found"
      );
    

    const balanceAtCompletion = Number(user.balance) - amount;

    const receiverName = receiverUser.lastName + " " + receiverUser.firstName;

    const transaction = await db.transactionModel.create({
      amount,
      description,
      receiverId: receiverUser._id.toString(),
      senderId: user.id,
      balanceAtCompletion,
      status: "completed",
      senderName: user.firstName + " " + user.lastName,
      receiverName,
      type: "Paid",
    });

    if (!transaction) throw new Error("Something went wrong");
    

    const userBalance = await encryptBalance(
      `${balanceAtCompletion}`,
      user.email + "." + Number(user.phoneNumber)
    );

    await db.userModel.updateOne({ _id: user.id }, { balance: userBalance });

    const passphrase =
      receiverUser.email + "." + Number(receiverUser.phoneNumber);

    const receiverDecryptBalance = await decryptBalance(
      receiverUser.balance,
      passphrase
    );

    const receiverBalanceAtCompletion = Number(receiverDecryptBalance) - amount;

    const receiverBalance = await encryptBalance(
      `${receiverBalanceAtCompletion}`,
      passphrase
    );

    await db.userModel.updateOne(
      { _id: receiverUser._id.toString() },
      { balance: receiverBalance }
    );

    return { message: "Transaction sent successfully" };
  } catch (error) {
    ErrorHandler(error);
  }
};

const decryptBalance = async (amount: string, passphrase: string) => {
  const newCryptr = await cryptr(passphrase);

  const balance = newCryptr.decrypt(amount);

  return balance;
};

const validateName = (
  inputName: string,
  dbFirstName: string,
  dbLastName: string
): boolean => {
  const name = inputName.split(" ");

  const firstCheck =
    name[0].toLowerCase() === dbFirstName.toLowerCase() &&
    name[1].toLowerCase() === dbLastName.toLowerCase();
  const secondCheck =
    name[0].toLowerCase() === dbLastName.toLowerCase() &&
    name[1].toLowerCase() === dbFirstName.toLowerCase();

  if (firstCheck || secondCheck) return true;
  

  return false;
};
export default sendTransaction;
