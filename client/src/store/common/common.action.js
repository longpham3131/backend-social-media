import { SET_NOTIFY } from "store/common/common.constant";

export const setNotify = (code) => {
  return { type: SET_NOTIFY, payload: code };
};
