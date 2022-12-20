import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@ObjectType()
export class MessageDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  message: string;
}
