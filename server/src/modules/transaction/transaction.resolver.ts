/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GetUser } from "../user/decorators/get-user.decorator";
import { UserDto } from "../user/dto";
import { JwtGuard } from "../user/jwt.guard";
import { MessageDto, TransactionsDto } from "./dto";
import { DepositTransactionInput, GetTransactionsInput, SendTransactionInput } from "./dto/inputs";
import { Transaction } from "./schema/transaction.schema";
import { TransactionService } from "./transaction.service";

@UseGuards(JwtGuard)
@Resolver((of) => Transaction)
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Mutation((returns) => MessageDto)
  async sendTransaction(
    @Args("input") input: SendTransactionInput,
    @GetUser() user: UserDto
  ): Promise<MessageDto> {
    return this.transactionService.sendTransaction(input, user);
  }

  @Mutation((returns) => MessageDto)
  async depositTransaction(
    @Args("input") input: DepositTransactionInput,
    @GetUser() user: UserDto
  ): Promise<MessageDto> {
    return this.transactionService.depositTransaction(input, user);
  }

  @Query((returns) => TransactionsDto, { name: "transactions" })
  async getTransactions(
    @Args("input") input: GetTransactionsInput,
    @GetUser("id") userId: string
  ): Promise<TransactionsDto> {
    return await this.transactionService.getTransactions(input, userId);
  }
}
