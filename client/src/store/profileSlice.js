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
      const { coverPicture, avatar, fullName, email, dateOfBirth } =
        action.payload;
      state = { ...state, coverPicture, avatar, fullName, email, dateOfBirth };
      return state;
    },
  },
});

const { reducer, actions } = profile;
export const { setProfile, editProfile } = actions;
export default reducer;
