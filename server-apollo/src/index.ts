import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { JwtPayload, verify } from "jsonwebtoken";
import mongoose from "mongoose";
import type { Context } from "./../typing.d";
import config from "./config";
import cryptr from "./helper/cryptr";
import db from "./models";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  introspection: true,
});

mongoose.set("strictQuery", false);
mongoose.connect(config.mongodb_uri).then(async () => {

  const { url } = await startStandaloneServer(server, {
    listen: { port: config.port },
    context: async ({ req, res }) => {
      let user: Context["user"] = null;
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = verify(token, config.jwt_secret) as JwtPayload;

        if (decodedToken) {
          const newUser = await db.userModel.findOne(
            {
              _id: decodedToken.sub,
              email: decodedToken.email,
            },
            {
              password: false,
            }
          );

          const passphrase = newUser.email + "." + Number(newUser.phoneNumber);

          const newCryptr = await cryptr(passphrase);

          const balance = newCryptr.decrypt(newUser.balance);

          user = {
            id: newUser._id.toString(),
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            balance,
            phoneNumber: newUser.phoneNumber,
            accountNumber: newUser.accountNumber,
            photoUrl: newUser.photoUrl,
          };
        }
      }

      return {
        user,
        req,
        res,
      };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
});
