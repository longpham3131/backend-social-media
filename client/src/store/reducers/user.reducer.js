import {
  CLEAR_NOTIFY,
  GET_USER_PROFILE,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_SUCCESS,
} from "../constants/user.constant";

const initialState = {
  profile: {},
  notify: null,
};

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USER_PROFILE:
      return { ...state, profile: payload.data };
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, profile: payload.data, notify: payload.status };
    case UPDATE_PROFILE_FAIL:
      return { ...state, notify: payload.status };

    case CLEAR_NOTIFY:
      return { ...state, notify: payload };
    default:
      return state;
  }
};
