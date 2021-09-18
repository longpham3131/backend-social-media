import { GET_USER_PROFILE } from "../constants/user.constant";

const initialState = {
  profile: {},
};

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USER_PROFILE:
      return { ...state, profile: payload };

    default:
      return state;
  }
};
