import { USER_AUTH, USER_REGISTER } from "./auth.constant";

const initialState = {
  auth: {},
  register: {},
};

export const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case USER_AUTH:
      console.log(payload,"payload")
      return { ...state, auth: payload };
    case USER_REGISTER:
      return { ...state, register: payload };
    default:
      return state;
  }
};
