import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


@InputType()
export class SendTransactionInput {
  @Field()
  @IsNumber()
  @IsNotEmpty()
  accountNumber: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  accountName: string;
  
  @Field()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Field({ nullable: true })
  @IsString()
  description?: string;

}