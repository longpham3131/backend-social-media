import { SET_NOTIFY } from "store/constants/common.constant";

export const setNotify = (code) => {
  return { type: SET_NOTIFY, payload: code };
};
