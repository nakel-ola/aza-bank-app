import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDto } from "../user/dto";
import { User, UserDocument } from "../user/schema/user.schema";
import { MessageDto, TransactionsDto } from "./dto";
import {
  DepositTransactionInput,
  GetTransactionsInput,
  SendTransactionInput,
} from "./dto/inputs";
import { Transaction, TransactionDocument } from "./schema/transaction.schema";
import cryptr from "src/helper/cryptr";

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  /**
   * It takes in a user's account number and the amount to be sent, checks if the user has enough
   * funds, then sends the amount to the receiver's account
   * @param {SendTransactionInput} input - SendTransactionInput
   * @param {UserDto} user - UserDto: This is the user that is currently logged in.
   * @returns A message
   */
  async sendTransaction(
    input: SendTransactionInput,
    user: UserDto
  ): Promise<MessageDto> {
    const canCreate = Number(user.balance) >= input.amount;

    if (!canCreate) {
      throw new ForbiddenException("Insufficient funds");
    }

    if (input.accountNumber === user.accountNumber) {
      throw new ForbiddenException("You can't send money to yourself");
    }

    const receiverUser = await this.userModel.findOne({
      accountNumber: input.accountNumber,
    });

    if (!receiverUser) {
      throw new NotFoundException(
        'User with account number "' + input.accountNumber + '" not found'
      );
    }

    if (
      !this.validateName(
        input.accountName,
        receiverUser.firstName,
        receiverUser.lastName
      )
    ) {
      throw new NotFoundException(
        "User with account name " + input.accountName + " not found"
      );
    }

    const balanceAtCompletion = Number(user.balance) - input.amount;

    const receiverName = receiverUser.lastName + " " + receiverUser.firstName;

    const transaction = await this.transactionModel.create({
      amount: input.amount,
      description: input.description,
      receiverId: receiverUser._id.toString(),
      senderId: user.id,
      balanceAtCompletion,
      status: "completed",
      senderName: user.firstName + " " + user.lastName,
      receiverName,
      type: "Paid",
    });

    if (!transaction) {
      throw new Error("Something went wrong");
    }

    const userBalance = await this.encryptBalance(
      `${balanceAtCompletion}`,
      user.email + "." + Number(user.phoneNumber)
    );

    await this.userModel.updateOne({ _id: user.id }, { balance: userBalance });

    const passphrase =
      receiverUser.email + "." + Number(receiverUser.phoneNumber);

    const receiverDecryptBalance = await this.decryptBalance(
      receiverUser.balance,
      passphrase
    );

    const receiverBalanceAtCompletion =
      Number(receiverDecryptBalance) - input.amount;

    const receiverBalance = await this.encryptBalance(
      `${receiverBalanceAtCompletion}`,
      passphrase
    );

    await this.userModel.updateOne(
      { _id: receiverUser._id.toString() },
      { balance: receiverBalance }
    );

    return { message: "Transaction sent successfully" };
  }

  /**
   * It takes in a user and an input object, checks if the amount is less than or equal to ₦10000,
   * creates a transaction, encrypts the user's balance and updates the user's balance
   * @param {DepositTransactionInput} input - DepositTransactionInput
   * @param {UserDto} user - UserDto: This is the user that is currently logged in.
   * @returns A message
   */
  async depositTransaction(
    input: DepositTransactionInput,
    user: UserDto
  ): Promise<MessageDto> {
    if (input.amount > 10000) {
      throw new ForbiddenException("Can only deposit ₦10000 and below at once");
    }
    const balanceAtCompletion = Number(user.balance) + input.amount;

    const name = user.firstName + " " + user.lastName;

    const transaction = await this.transactionModel.create({
      amount: input.amount,
      description: input.description,
      receiverId: user.id,
      senderId: user.id,
      balanceAtCompletion,
      status: "completed",
      senderName: name,
      receiverName: name,
      type: "Deposit",
    });

    if (!transaction) {
      throw new Error("Something went wrong");
    }

    const userBalance = await this.encryptBalance(
      `${balanceAtCompletion}`,
      user.email + "." + Number(user.phoneNumber)
    );

    await this.userModel.updateOne({ _id: user.id }, { balance: userBalance });

    return { message: "Transaction deposit successfully" };
  }

  /**
   * It returns a paginated list of transactions for a given user
   * @param {GetTransactionsInput} input - GetTransactionsInput
   * @param {string} userId - The userId of the user who is making the request.
   * @returns return {
   *     page,
   *     totalItems: transaction.length,
   *     results: transaction.slice(start, end),
   *   };
   */
  async getTransactions(
    input: GetTransactionsInput,
    userId: string
  ): Promise<TransactionsDto> {
    const page = input?.page ?? 1,
      limit = input?.limit ?? 10,
      start = (page - 1) * limit,
      end = limit + start;

    console.log(input);

    const transaction = await this.transactionModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    return {
      page,
      totalItems: transaction.length,
      results: transaction.slice(start, end),
    };
  }

  /**
   * It takes a string and a passphrase, and returns an encrypted string
   * @param {string} amount - The amount of the balance you want to encrypt.
   * @param {string} passphrase - The passphrase that the user entered when they created their account.
   * @returns The encrypted balance.
   */
  private async encryptBalance(amount: string, passphrase: string) {
    const newCryptr = await cryptr(passphrase);

    const balance = newCryptr.encrypt(amount);

    return balance;
  }

  /**
   * It takes a string, decrypts it, and returns the decrypted string
   * @param {string} amount - The encrypted balance
   * @param {string} passphrase - The passphrase that was used to encrypt the balance.
   * @returns The balance is being returned.
   */
  private async decryptBalance(amount: string, passphrase: string) {
    const newCryptr = await cryptr(passphrase);

    const balance = newCryptr.decrypt(amount);

    return balance;
  }

  /**
   * It takes in a string, splits it into an array, and then compares the first and last name of the
   * array to the first and last name of the database
   * @param {string} inputName - The name that the user entered
   * @param {string} dbFirstName - The first name of the user in the database
   * @param {string} dbLastName - The last name of the user in the database
   * @returns A boolean value.
   */
  private validateName(
    inputName: string,
    dbFirstName: string,
    dbLastName: string
  ): boolean {
    const name = inputName.split(" ");

    const firstCheck =
      name[0].toLowerCase() === dbFirstName.toLowerCase() &&
      name[1].toLowerCase() === dbLastName.toLowerCase();
    const secondCheck =
      name[0].toLowerCase() === dbLastName.toLowerCase() &&
      name[1].toLowerCase() === dbFirstName.toLowerCase();

    if (firstCheck || secondCheck) {
      return true;
    }

    return false;
  }
}
