import * as argon from "argon2";
import { GraphQLError } from "graphql/error";
import { z } from "zod";
import cryptr from "../helper/cryptr";
import ErrorHandler from "../helper/errorHandler";
import signToken from "../helper/signToken";
import db from "../models";
import emailer from "../helper/emailer";
import { welcomeMsg } from "../helper/emailData";
import config from "../config";

const ArgsSchema = z.object({
  input: z.object({
    firstName: z.string().min(3, "First name must be at least 3 characters"),
    lastName: z.string().min(3, "Last name must be at least 3 characters"),
    email: z.string().email("Invalid Email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phoneNumber: z
      .string()
      .min(9, "Phone number must be at least 9 characters")
      .max(11, "Phone number must be at least 11 characters or less"),
  }),
});

type Args = Required<z.infer<typeof ArgsSchema>>;

const register = async (root: any, args: Args) => {
  try {
    ArgsSchema.parse(args);
    const { password, phoneNumber, email, firstName, lastName } = args.input;
    const hash = await argon.hash(password);
    const passphrase = email + "." + Number(phoneNumber);
    const newCryptr = await cryptr(passphrase);

    const balance = newCryptr.encrypt("10000");
    const photoUrl = `https://avatars.dicebear.com/api/adventurer-neutral/${firstName}.svg`;

    const user = await db.userModel.create({
      phoneNumber,
      accountNumber: Number(phoneNumber),
      password: hash,
      balance,
      email,
      photoUrl,
      firstName,
      lastName,
    });

    if (!user) {
      throw new GraphQLError("Something went wrong");
    }

      await emailer({
        from: config.email_from,
        to: email,
        subject: `Welcome to the Aza family!`,
        text: "",
        html: welcomeMsg({ name: firstName + " " + lastName }),
      });

    return {
      access_token: signToken(user._id.toString(), user.email),
    };
  } catch (err: any) {
    ErrorHandler(err);
  }
};

export default register;
