import changePassword from "./change-password";
import forgetPassword from "./forget-password";
import login from "./login";
import register from "./register";
import types from "./types";
import user from "./user";
import validateCode from "./validate-code";

const userQueries = { user };
const userMutations = {
  register,
  login,
  forgetPassword,
  validateCode,
  changePassword,
};

const userTypes = types;

export { userQueries, userMutations, userTypes };
