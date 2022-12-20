import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { CloudStorageService } from "../../helper/cloud-storage.service";
import { MailModule } from "../mail/mail.module";
import { JwtStrategy } from "./schema/jwt.strategy";
import { User, UserSchema } from "./schema/user.schema";
import { Validate, ValidateSchema } from "./schema/validate.schema";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Validate.name,
        schema: ValidateSchema,
      },
    ]),
    MailModule
  ],
  providers: [UserService, UserResolver, JwtStrategy, CloudStorageService],
})
export class UserModule {}
