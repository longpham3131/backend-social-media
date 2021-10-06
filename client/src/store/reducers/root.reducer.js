import { combineReducers } from "redux";
import { authReducer } from "./auth.reducer";
import { userReducer } from "./user.reducer";
import { postReducer } from "./post.reducer";
import { commonReducer } from "./common.reducer";

const rootReducer = combineReducers({
  authReducer,
  userReducer,
  postReducer,
  commonReducer,
});

export default rootReducer;
