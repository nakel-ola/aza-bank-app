import { StreamableFile } from "@nestjs/common";
import { Field, InputType } from "@nestjs/graphql";
import { GraphQLUpload } from "graphql-upload-minimal";

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
