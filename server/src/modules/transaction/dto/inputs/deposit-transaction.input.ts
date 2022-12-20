import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@InputType()
export class DepositTransactionInput {
  @Field()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Field({ nullable: true })
  @IsString()
  description: string;
}
