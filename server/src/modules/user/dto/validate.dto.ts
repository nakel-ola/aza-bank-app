import { ObjectType,Field } from "@nestjs/graphql";
import { IsBoolean } from "class-validator";

@ObjectType()
export class ValidateDto {
  @IsBoolean()
  @Field()
  validate: boolean;
}
