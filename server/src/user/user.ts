import type { Context } from "../../typing";

const user = (root: any, args: any, context: Context) => {
  if (!context.user) {
    throw new Error("Invalid credentials");
  }
  return context.user;
};

export default user;
