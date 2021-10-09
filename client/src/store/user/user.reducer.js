import {
  CLEAR_NOTIFY,
  GET_USER_PROFILE,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_SUCCESS,
} from "./user.constant";

const initialState = {
  profile: {},
};

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USER_PROFILE:
      console.log(payload);
      return { ...state, profile: payload.data };
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, profile: payload.data };
    case UPDATE_PROFILE_FAIL:
      return { ...state };
    default:
      return state;
  }
};
