import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNumber } from "class-validator";

@InputType()
export class GetTransactionsInput {
  @Field(() => Int)
  @IsNumber()
  page: number;

  @Field(() => Int)
  @IsNumber()
  limit: number;
}
