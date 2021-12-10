import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./postSlice";
import profileReducer from "./profileSlice";
const rootReducer = {
  posts: postReducer,
  profile: profileReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
