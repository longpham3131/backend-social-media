import {
  CREATE_POST_SUCCESS,
  CREATE_POST_FAIL,
  EDIT_POST_SUCCESS,
  EDIT_POST_FAIL,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAIL,
  GET_POST_LIST,
} from "store/constants/post.constant";

const initialState = {
  postList: [],
  notify: null,
};

export const postReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_POST_LIST:
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
    default:
      return state;
  }
};
