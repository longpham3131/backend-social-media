import { createSlice } from "@reduxjs/toolkit";

const post = createSlice({
  name: "posts",
  initialState: [],
  reducers: {
    setPostList: (state, action) => {
      state = action.payload;
      return state;
    },
    addMorePost: (state, action) => {
      state = [...state, ...action.payload];
      return state;
    },
    createPost: (state, action) => {
      state.unshift(action.payload);
    },
    editPost: (state, action) => {
      const index = state.findIndex((item) => item._id === action.payload._id);
      state[index] = action.payload;
      return state;
    },
    deletePost: (state, action) => {
      state = state.filter((item) => item._id !== action.payload);
      return state;
    },
    //comment
    createComment: (state, action) => {
      const index = state.findIndex(
        (item) => item._id === action.payload.postId
      );
      state[index].comments.unshift(action.payload.comment);
      return state;
    },
    deletePostComment: (state, action) => {
      console.log("state", state, "action", action.payload);
      const index = state.findIndex(
        (item) => item._id === action.payload.postId
      );
      state[index].comments = state[index].comments.filter(
        (cmt) => cmt._id != action.payload.commentId
      );

      return state;
    },
    //like
    likePost: (state, action) => {
      const { like, postId, user } = action.payload;

      const index = state.findIndex((item) => item._id === postId);
      if (like) {
        state[index].like.unshift({ user });
      } else {
        state[index].like = state[index].like.filter(
          (item) => item.user._id !== user._id
        );
      }

      return state;
    },
  },
});

const { reducer, actions } = post;
export const {
  setPostList,
  createPost,
  editPost,
  deletePost,
  createComment,
  likePost,
  addMorePost,
  deletePostComment,
} = actions;
export default reducer;
