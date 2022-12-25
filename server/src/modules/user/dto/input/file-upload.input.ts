import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FileUploadInput {
  @Field()
  filename: string;

  @Field()
  mimetype: string;

  @Field()
  encoding: string;

  @Field(() => String)
  createReadStream: string;
}
