import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
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
}
