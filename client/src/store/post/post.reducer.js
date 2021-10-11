import {
  CREATE_POST_SUCCESS,
  CREATE_POST_FAIL,
  EDIT_POST_SUCCESS,
  EDIT_POST_FAIL,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAIL,
  GET_POST_LIST,
  LIKE_POST_SUCCESS,
} from "store/post/post.constant";

const initialState = {
  postList: [],
  notify: null,
};

export const postReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_POST_LIST:
      console.log(payload);
      return { ...state, postList: payload };
    //CREATE
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        postList: [payload.data, ...state.postList],
      };
    case CREATE_POST_FAIL:
      return {
        ...state,
      };
    //EDIT
    case EDIT_POST_SUCCESS:
      return {
        ...state,
        postList: state.postList.map((post) => {
          if (post._id === payload.data._id) {
            post = payload.data;
          }
          return post;
        }),
      };
    case EDIT_POST_FAIL:
      return {
        ...state,
      };
    //DELETE
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        postList: state.postList.filter(
          (post) => post._id !== payload.data.postId
        ),
      };
    case DELETE_POST_FAIL:
      return {
        ...state,
      };
    case LIKE_POST_SUCCESS:
      const { like, user, postId } = payload;
      let listNewPosts = state.postList.map((post) => {
        if (postId === post._id) {
          if (like) {
            post.like.push({ user: user });
          } else {
            post.like = post.like.filter((item) => item.user._id !== user._id);
          }
        }
        return post;
      });
      return {
        ...state,
        postList: listNewPosts,
      };
    default:
      return state;
  }
};
