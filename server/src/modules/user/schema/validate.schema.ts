/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ValidateDocument = HydratedDocument<Validate>;

@ObjectType()
@Schema({
  timestamps: true,
})
export class Validate {
  @Field((type) => ID)
  id: string;

  @Field()
  @Prop({ required: true, type: String })
  email: string;

  @Field()
  @Prop({ required: true, type: String })
  validationToken: string;
}

export const ValidateSchema = SchemaFactory.createForClass(Validate);
