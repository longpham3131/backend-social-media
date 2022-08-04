import { createSlice } from "@reduxjs/toolkit";

const profile = createSlice({
  name: "profile",
  initialState: {},
  reducers: {
    setProfile: (state, action) => {
      state = action.payload;
      return state;
    },
    editProfile: (state, action) => {
      const payload = action.payload;
      state = { ...state, ...payload };
      return state;
    },
    changePassword: (state, action) => {
      state.password = action.payload;
      return state;
    },
  },
});

const { reducer, actions } = profile;
export const { setProfile, editProfile, changePassword } = actions;
export default reducer;
