import {
  GET_USER_PROFILE,
  UPDATE_PROFILE_SUCCESS,
} from "../constants/user.constant";

const initialState = {
  profile: {},
};

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USER_PROFILE:
      return { ...state, profile: payload };
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, profile: payload };
    default:
      return state;
  }
};
