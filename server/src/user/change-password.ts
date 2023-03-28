import * as argon from "argon2";
import { z } from "zod";
import ErrorHandler from "../helper/errorHandler";
import signToken from "../helper/signToken";
import db from "../models";
import emailer from "../helper/emailer";
import { passwordChangeMail } from "../helper/emailData";
import config from "../config";

const ArgsSchema = z.object({
  input: z.object({
    email: z.string().email("Invalid Email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    validationToken: z
      .number()
      .min(5, "Validation token must be 5 characters")
      .max(5, "Validation token must be 5 characters"),
  }),
});

type Args = Required<z.infer<typeof ArgsSchema>>;

const changePassword = async (root: any, args: Args) => {
  try {
    ArgsSchema.parse(args);
    const { email, password, validationToken } = args.input;

    const validate = await db.validateModel.findOne({
      email,
      validationToken,
    });

    if (!validate) {
      throw new Error("Credentials incorrect");
    }

    const hash = await argon.hash(password);

    const user = await db.userModel.updateOne({ email }, { password: hash });

    if (!user) {
      throw new Error("Something went wrong");
    }

    const newUser = await db.userModel.findOne({ email });

    if (!newUser) {
      throw new Error("Something went wrong");
    }

    await db.validateModel.deleteOne({ email });

    await emailer({
      from: config.email_from,
      to: email,
      subject: "Your password was changed",
      text: null,
      html: passwordChangeMail({
        name: newUser.firstName + " " + newUser.lastName,
        email,
      }),
    });

    return {
      access_token: signToken(newUser._id.toString(), newUser.email),
    };
  } catch (err: any) {
    ErrorHandler(err);
  }
};

export default changePassword;
