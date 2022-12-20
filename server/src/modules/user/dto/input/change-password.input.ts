import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

@InputType()
export class ChangePasswordInput {
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

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Field()
  password: string;
}
