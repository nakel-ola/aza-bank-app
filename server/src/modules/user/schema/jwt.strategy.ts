import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import cryptr from "../../../helper/cryptr";
import { User, UserDocument } from "./user.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    config: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get("JWT_SECRET"),
    });
  }
  async validate(payload: { sub: string; email: string }) {
    const user = await this.userModel.findById(
      { _id: payload.sub },
      { password: false }
    );

    delete user.password;

    const passphrase = user.email + "." + Number(user.phoneNumber);

    const newCryptr = await cryptr(passphrase);

    const balance = newCryptr.decrypt(user.balance);

    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      balance,
      phoneNumber: user.phoneNumber,
      accountNumber: user.accountNumber,
      photoUrl: user.photoUrl,
    };
  }
}
