import { GraphQLError } from "graphql/error";
import { z } from "zod";
import generateCode from "../helper/generateCode";
import db from "../models";
import ErrorHandler from "../helper/errorHandler";
import emailer from "../helper/emailer";
import { verificationMail } from "../helper/emailData";
import config from "../config";

const ArgsSchema = z.object({
  email: z.string().email("Invalid Email"),
});

type Args = Required<z.infer<typeof ArgsSchema>>;

const forgetPassword = async (root: any, args: Args) => {
  try {
    ArgsSchema.parse(args);
    const { email } = args;
    const id = generateCode(11111, 99999);

    const user = await db.userModel.findOne({ email });

    if (!user) {
      throw new GraphQLError("Credentials incorrect");
    }

    const obj = {
      email,
      validationToken: id,
    };

    const validate = await db.validateModel.findOne({ email });

    if (!validate) {
      await db.validateModel.create(obj);
    }

    const code = validate ? validate.validationToken : id;

    console.log(code);

    await emailer({
      from: config.email_from,
      to: email,
      subject: `Your Aza Bank app verification code`,
      text: null,
      html: verificationMail({
        code,
        name: user.firstName + " " + user.lastName,
      }),
    });

    return { message: "Credential verified" };
  } catch (err) {
    ErrorHandler(err)
  }
};

export default forgetPassword;
