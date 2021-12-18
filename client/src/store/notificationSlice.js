import { createSlice } from "@reduxjs/toolkit";

const notification = createSlice({
  name: "notification",
  initialState: {},
  reducers: {
    setNoti: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

const { reducer, actions } = notification;
export const { setNoti } = actions;
export default reducer;
