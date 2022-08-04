import { createSlice } from "@reduxjs/toolkit";

const modalPost = createSlice({
  name: "modalPost",
  initialState: {
    show: false,
    postId: "",
    mediaSelectedId: "",
  },
  reducers: {
    setModalPost: (state, action) => {
      state = action.payload;
      return state;
    },
    editModalPost: (state, action) => {
      const payload = action.payload;
      state = { ...state, ...payload };
      return state;
    },
  },
});

const { reducer, actions } = modalPost;
export const { setModalPost, editModalPost } = actions;
export default reducer;
