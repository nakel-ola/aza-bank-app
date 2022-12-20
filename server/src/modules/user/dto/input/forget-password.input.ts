import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class ForgetPasswordInput {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;
}
