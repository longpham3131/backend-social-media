import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./postSlice";
import profileReducer from "./profileSlice";
import userReducer from "./userSlice";
const rootReducer = {
  posts: postReducer,
  profile: profileReducer,
  user:userReducer
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
