import { GET_POST_LIST } from "store/constants/post.constant";

const initialState = {
  postList: {},
};

export const postReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_POST_LIST:
      return { ...state, postList: payload };

    default:
      return state;
  }
};
