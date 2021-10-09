import { combineReducers } from "redux";
import { authReducer } from "../auth/auth.reducer";
import { userReducer } from "../user/user.reducer";
import { postReducer } from "../post/post.reducer";
import { commonReducer } from "../common/common.reducer";
import { notificationReducer } from "../notifications/notifications.reducer";

const rootReducer = combineReducers({
  authReducer,
  userReducer,
  postReducer,
  commonReducer,
  notificationReducer
});

export default rootReducer;
