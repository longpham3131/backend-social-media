
import { USER_AUTH, USER_REGISTER } from "./auth.constant";


export const loginAction = (res) => {
  return { type: USER_AUTH, payload: res };
};

export const registerAction = (res) => {
  return { type: USER_REGISTER, payload: res };
};
