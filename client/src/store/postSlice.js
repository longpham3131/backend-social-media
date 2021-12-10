import { createSlice } from "@reduxjs/toolkit";

const post = createSlice({
  name: "posts",
  initialState: [],
  reducers: {
    setPostList: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

const { reducer, actions } = post;
export const { setPostList } = actions;
export default reducer;
