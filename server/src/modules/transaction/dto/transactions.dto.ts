/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Transaction } from "../schema/transaction.schema";

@ObjectType()
export class TransactionsDto {
  @Field((type) => Int)
  page: number;

  @Field((type) => Int)
  totalItems: number;

  @Field((type) => [Transaction])
  results: Transaction[];
}
