/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@ObjectType()
@Schema({
  timestamps: true,
})
export class User {
  @Field((type) => ID)
  id: string;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field()
  @Prop({ required: true })
  balance: string;

  @Field()
  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Field()
  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, type: String, unique: true })
  @Field()
  phoneNumber: string;

  @Prop({ required: true, type: Number, unique: true })
  @Field()
  accountNumber: number;

  @Prop({ required: false, type: String })
  @Field({ nullable: true })
  photoUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
