import { USER_LOGIN, USER_REGISTER } from "../constants/auth.constant";

const initialState = {
  login: {},
  register: {},
};

export const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case USER_LOGIN:
      return { ...state, login: payload };
    case USER_REGISTER:
      return { ...state, register: payload };
    default:
      return state;
  }
};
