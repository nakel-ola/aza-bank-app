/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserDto {
  @Field((type) => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  balance: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;
  
  @Field()
  accountNumber: number;

  @Field({ nullable: true })
  photoUrl?: string;
}
