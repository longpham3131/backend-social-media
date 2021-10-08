import { SET_NOTIFY } from "store/common/common.constant";

const initialState = {
  notify: null,
};

export const commonReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_NOTIFY:
      return { type: SET_NOTIFY, notify: payload };
    default:
      return state;
  }
};
