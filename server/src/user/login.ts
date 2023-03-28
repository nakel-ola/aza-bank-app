import * as argon from "argon2";
import { GraphQLError } from "graphql/error";
import { z } from "zod";
import ErrorHandler from "../helper/errorHandler";
import signToken from "../helper/signToken";
import db from "../models";

const ArgsSchema = z.object({
  input: z.object({
    email: z.string().email("Invalid Email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

type Args = Required<z.infer<typeof ArgsSchema>>;

/**
 * We find a user by email, check if the password matches, and if it does, we return a signed JWT
 * @param {Args} args - LoginInput
 */
const login = async (root: any, args: Args) => {
  try {
    ArgsSchema.parse(args);
    const { email, password } = args.input;

    //  find user with emall
    const user = await db.userModel.findOne({ email });

    // if user does not exit throw exception
    if (!user) {
      throw new GraphQLError("Credentials incorrect");
    }

    //   compare password
    const pwMatches = await argon.verify(user.password, password);

    // if password incorrect throw exception
    if (!pwMatches) {
      throw new GraphQLError("Credentials incorrect");
    }

    return {
      access_token: signToken(user._id.toString(), user.email),
    };
  } catch (err: any) {
    ErrorHandler(err);
  }
};
export default login;
