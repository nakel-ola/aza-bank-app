import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TransactionDocument = HydratedDocument<Transaction>;

@ObjectType()
@Schema({
  timestamps: true,
})
export class Transaction {
  @Field((type) => ID)
  id: string;

  @Field()
  @Prop({ required: true })
  amount: number;

  @Field({ nullable: true })
  @Prop({ required: false })
  description?: string;

  @Field()
  @Prop({ required: true })
  receiverId: string;

  @Field()
  @Prop({ required: true })
  receiverName: string;

  @Field()
  @Prop({ required: true })
  senderId: string;

  @Field()
  @Prop({ required: true })
  senderName: string;

  @Field()
  @Prop({ required: true })
  type: "Paid" | "Withdrawal" | "Deposit";

  @Field()
  @Prop({ required: false })
  balanceAtCompletion?: number;

  @Field()
  @Prop({ required: true })
  status: "pending" | "completed" | "canceled";

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
