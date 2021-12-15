import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setProfile: (state, action) => {
      state = action.payload;
      return state;
    },
    editProfile: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

const { reducer, actions } = user;
export const { setProfile, editProfile } = actions;
export default reducer;
