import { Field, InputType } from "@nestjs/graphql";
import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsString,
  MinLength,
} from "class-validator";

@InputType()
export class RegisterInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Field()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Field()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Field()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(11)
  @Field()
  phoneNumber: string;
}
