import { GET_NOTI_SUCCESS } from "./notification.constant";

const initialState = {
  notifications: [],
};

export const notificationReducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case GET_NOTI_SUCCESS:
      return { ...state, notifications: payload.data };
    default:
      return state;
  }
};
