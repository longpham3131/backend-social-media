import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./postSlice";
import profileReducer from "./profileSlice";
import groupReducer from "./groupSlice";
const rootReducer = {
  posts: postReducer,
  profile: profileReducer,
  group: groupReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
