import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { PayloadAction } from "./../../../node_modules/@reduxjs/toolkit/src/createAction";

export type PopupState = {
  open: boolean;
  type: string | null;
  data?: any;
};

export const popupSlice = createSlice({
  name: "popup",
  initialState: {
    open: false,
    type: null,
    data: null,
  } as PopupState,
  reducers: {
    handleOpen: (
      state: PopupState,
      action: PayloadAction<{ type: string; data?: any }>
    ) => {
      state.open = true;
      state.type = action.payload.type;
      state.data = action.payload?.data;
    },
    handleClose: (state: PopupState) => {
      state.open = false;
      state.type = null;
      state.data = null;
    },
  },
});

export const { handleClose, handleOpen } = popupSlice.actions;

export const selectPopup = (state: RootState) => state.popup;

export default popupSlice.reducer;
