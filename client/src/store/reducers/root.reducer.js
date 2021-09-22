import { combineReducers } from "redux";
import { authReducer } from "./auth.reducer";
import { userReducer } from "./user.reducer";
import { postReducer } from "./post.reducer";

const rootReducer = combineReducers({
  authReducer,
  userReducer,
  postReducer,
});

export default rootReducer;
