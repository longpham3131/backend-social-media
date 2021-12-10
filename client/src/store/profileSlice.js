import { createSlice } from "@reduxjs/toolkit";

const profile = createSlice({
  name: "profile",
  initialState: {},
  reducers: {
    setProfile: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

const { reducer, actions } = profile;
export const { setProfile } = actions;
export default reducer;
