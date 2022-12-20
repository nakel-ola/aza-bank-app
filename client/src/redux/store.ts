import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import popupReducer, { PopupState } from "./features/popupSlice";
import userReducer, { UserState } from "./features/userSlice";

export type RootState = {
  user: UserState;
  popup: PopupState
};

const combinedReducer = combineReducers({
  user: userReducer,
  popup: popupReducer
});

const masterReducer = (state: any, action: AnyAction) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      user: {
        ...state.user,
        user: action.payload.user.user ?? null,
        cookies: action.payload.user.cookies ?? null,
      },
      category: {
        category: action.payload.category.category ?? [],
      },
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer: masterReducer,
    devTools: true,
  });

export const wrapper = createWrapper(makeStore, { debug: false });
