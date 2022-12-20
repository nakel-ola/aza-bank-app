import { Types } from "mongoose";
import { LoginInput, RegisterInput } from "../../dto/input";
import { User } from "../../schema/user.schema";

export const userStub: Omit<User, "password"> = {
  id: new Types.ObjectId().toHexString(),
  email: "user@example.com",
  accountNumber: 9152663635,
  balance: "100000",
  firstName: "firstName",
  lastName: "lastName",
  phoneNumber: "0",
  photoUrl: null,
};

export const testUser: LoginInput = {
  email: "user@example.com",
  password: "password",
};

export const registerUser: RegisterInput = {
  email: "user@example.com",
  firstName: "firstName",
  lastName: "lastName",
  phoneNumber: "09152663635",
  password: "password",
};
