import { createSlice } from "@reduxjs/toolkit";
import { UserType, ValidateCodeType } from "../../../typing";
import { getStorage } from "../../utils/localStorage";
import { RootState } from "../store";

export let key = "wujo_login_profile";
export const win = typeof window !== "undefined" ? window : ({} as Window);

export type UserState = {
  user: UserType | null;
  validateUser: ValidateCodeType | null;
  cookies: { auth: string } | null;
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    validateUser: null,
    cookies: null,
  } as UserState,
  reducers: {
    login: (state: UserState, action) => {
      state.user = action.payload;
    },
    logout: (state: UserState) => {
      state.cookies = null;
      state.user = null;
    },
    forget: (state: UserState, action) => {
      state.validateUser = action.payload;
    },
    setCookies: (state: UserState, action) => {
      state.cookies = action.payload;
    },
  },
});

export const { login, logout, forget, setCookies } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectValidateUser = (state: RootState) => state.user.validateUser;
export const selectCookies = (state: RootState) => state.user.cookies;

export default userSlice.reducer;
