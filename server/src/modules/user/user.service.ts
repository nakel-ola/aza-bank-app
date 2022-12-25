import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as argon from "argon2";
import { Model } from "mongoose";
import {
  passwordChangeMail,
  verificationMail,
  welcomeMsg,
} from "../../data/emailData";
import { CloudStorageService } from "../../helper/cloud-storage.service";
import cryptr from "../../helper/cryptr";
import generateCode from "../../helper/generateCode";
import { MailService } from "../mail/mail.service";
import { MessageDto } from "../transaction/dto";
import { TokenDto, UserDto, ValidateDto } from "./dto";
import {
  ChangePasswordInput,
  ForgetPasswordInput,
  LoginInput,
  RegisterInput,
  ValidateCodeInput,
} from "./dto/input";
import { FileUpload } from "./interface/file-upload.interface";
import { User, UserDocument } from "./schema/user.schema";
import { Validate, ValidateDocument } from "./schema/validate.schema";

@Injectable()
export class UserService {
  private readonly email_from = '"Aza Bank Team" noreply@azabank.com';

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Validate.name)
    private readonly validateModel: Model<ValidateDocument>,
    private jwt: JwtService,
    private config: ConfigService,
    private cloudStorageService: CloudStorageService,
    private mailService: MailService
  ) {}

  /**
   * It takes in a user's email, phone number and password, hashes the password, encrypts the user's
   * balance, creates a new user and returns a token
   * @param {RegisterInput} input - RegisterInput
   * @returns A token
   */
  public async register(input: RegisterInput): Promise<TokenDto> {
    try {
      const hash = await argon.hash(input.password);
      const passphrase = input.email + "." + Number(input.phoneNumber);
      const newCryptr = await cryptr(passphrase);

      const balance = newCryptr.encrypt("10000");

      const user = await this.userModel.create({
        ...input,
        phoneNumber: input.phoneNumber,
        accountNumber: Number(input.phoneNumber),
        password: hash,
        balance,
      });

      if (!user) {
        throw new Error("Something went wrong");
      }

      if (this.config.get("NODE_ENV") !== "test") {
        await this.mailService.sendUserConfirmation({
          from: this.email_from,
          to: input.email,
          subject: `Welcome to the Aza family!`,
          text: "",
          html: welcomeMsg({ name: input.firstName + " " + input.lastName }),
        });
      }

      return {
        access_token: this.signToken(user._id.toString(), user.email),
      };
    } catch (err) {
      if (err.code === 11000) {
        const errorKey = Object.keys(err.keyValue);
        const errorMsg = errorKey.map((key) => uniqueError[key]).join(",");
        throw new ForbiddenException(errorMsg);
      } else {
        console.log(err);
        throw new Error(err.message);
      }
    }
  }

  /**
   * We find a user by email, check if the password matches, and if it does, we return a signed JWT
   * @param {LoginInput} input - LoginInput
   */
  public async login(input: LoginInput): Promise<TokenDto> {
    //  find user with emall
    const user = await this.userModel.findOne({
      email: input.email,
    });

    // if user does not exit throw exception
    if (!user) {
      throw new NotFoundException("Credentials incorrect");
    }

    //   compare password
    const pwMatches = await argon.verify(user.password, input.password);

    // if password incorrect throw exception
    if (!pwMatches) {
      throw new NotFoundException("Credentials incorrect");
    }

    return {
      access_token: this.signToken(user._id.toString(), user.email),
    };
  }

  /**
   * It takes an email address as input, checks if the email address exists in the database, if it
   * does, it generates verification code and saves it in the database, if it doesn't, it throws an error
   * @param {ForgetPasswordInput} input - ForgetPasswordInput
   * @returns A message saying "Credential verified"
   */
  public async forgetPassword(input: ForgetPasswordInput): Promise<MessageDto> {
    const id = generateCode(11111, 99999);

    const user = await this.userModel.findOne({ email: input.email });

    if (!user) {
      throw new NotFoundException("Credentials incorrect");
    }

    const obj = {
      email: input.email,
      validationToken: id,
    };

    const validate = await this.validateModel.findOne({ email: input.email });

    if (!validate) {
      await this.validateModel.create(obj);
      console.log(id);
    } else {
      console.log(validate.validationToken);
    }

    const code = validate ? validate.validationToken : id;

    await this.mailService.sendUserConfirmation({
      from: this.email_from,
      to: input.email,
      subject: `Your Aza Bank app verification code`,
      text: null,
      html: verificationMail({
        code,
        name: user.firstName + " " + user.lastName,
      }),
    });

    return { message: "Credential verified" };
  }

  /**
   * It takes in a ValidateCodeInput object, finds a validateModel object that matches the input, and
   * returns a ValidateDto object
   * @param {ValidateCodeInput} input - ValidateCodeInput
   * @returns A boolean value.
   */
  public async validateCode(input: ValidateCodeInput): Promise<ValidateDto> {
    const validate = await this.validateModel.findOne(input);

    if (!validate) return { validate: false };

    return { validate: true };
  }

  /**
   * It takes in an email, password, and validation token, checks if the email and validation token are
   * in the database, if they are, it updates the password, and returns a new access token
   * @param {ChangePasswordInput} input - ChangePasswordInput
   * @returns The access token
   */
  public async changePassword(input: ChangePasswordInput) {
    const { email, password, validationToken } = input;
    const validate = await this.validateModel.findOne({
      email,
      validationToken,
    });

    if (!validate) {
      throw new NotFoundException("Credentials incorrect");
    }

    const hash = await argon.hash(password);

    const user = await this.userModel.updateOne({ email }, { password: hash });

    if (!user) {
      throw new Error("Something went wrong");
    }

    const newUser = await this.userModel.findOne({ email });

    if (!newUser) {
      throw new Error("Something went wrong");
    }

    await this.validateModel.deleteOne({ email });

    await this.mailService.sendUserConfirmation({
      from: this.email_from,
      to: email,
      subject: "Your password was changed",
      text: null,
      html: passwordChangeMail({
        name: newUser.firstName + " " + newUser.lastName,
        email,
      }),
    });

    return {
      access_token: this.signToken(newUser._id.toString(), newUser.email),
    };
  }

  /**
   * It takes a file and a user, deletes the old image, uploads the new one and updates the user's
   * photoUrl
   * @param {FileUpload} file - FileUpload - This is the file that we are uploading.
   * @param {UserDto} user - UserDto - This is the user object that we are going to update.
   */
  public async updatePhotoUrl(file: Promise<FileUpload>, user: UserDto) {
    if (user.photoUrl) await this.cloudStorageService.removeFile(user.photoUrl);
    const url = await this.cloudStorageService.uploadFile(await file);
    const newUser = await this.userModel.updateOne(
      { email: user.email },
      { photoUrl: url }
    );
    if (!newUser) {
      throw new Error("Something went wrong");
    }

    return { message: "Successfull uploaded" };
  }

  /**
   * It signs a JWT token using the user's ID, email, and an optional expiration date
   * @param {string} userId - The user's ID
   * @param {string} email - The email of the user
   * @param {string} [expires] - The time in seconds that the token will expire.
   * @returns A token
   */
  private signToken(userId: string, email: string, expires?: string): string {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get("JWT_SECRET");
    const expiresIn = expires ?? this.config.get("EXPIRES_IN");

    const token = this.jwt.sign(payload, {
      expiresIn,
      secret,
    });

    return token;
  }
}

/* An object that holds the error messages that will be thrown when a user tries to register with an
email, phone number that already exists in the database. */
const uniqueError = {
  phoneNumber: "Phone number taken",
  email: "Email taken",
};
