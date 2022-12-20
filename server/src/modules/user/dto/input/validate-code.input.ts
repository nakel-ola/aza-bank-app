import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

@InputType()
export class ValidateCodeInput {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(5, 5)
  validationToken: string;
}
