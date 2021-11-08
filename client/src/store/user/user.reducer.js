import {
  CLEAR_NOTIFY,
  GET_USER_PROFILE,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_SUCCESS,
  GET_USER_CURRENT_PROFILE
} from "./user.constant";

const initialState = {
  profile: {},
  profileCurentUser:{}
};

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USER_PROFILE:
      return { ...state, profile: payload.data };
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, profile: payload.data };
    case UPDATE_PROFILE_FAIL:
      return { ...state };
    case GET_USER_CURRENT_PROFILE:
      return { ...state, profileCurentUser: payload.data };
    default:
      return state;
  }
};
