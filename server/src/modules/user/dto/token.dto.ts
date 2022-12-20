import { ObjectType,Field } from "@nestjs/graphql";
import { IsJWT, IsNotEmpty, IsString } from "class-validator";

@ObjectType()
export class TokenDto {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  @Field()
  access_token: string;
}
