import { combineReducers } from "redux";
import { authReducer } from "./auth.reducer";
import { userReducer } from "./user.reducer";
import { postReducer } from "./post.reducer";
import { commonReducer } from "./common.reducer";
import { notificationReducer } from "../notifications/notifications.reducer";

const rootReducer = combineReducers({
  authReducer,
  userReducer,
  postReducer,
  commonReducer,
  notificationReducer
});

export default rootReducer;
