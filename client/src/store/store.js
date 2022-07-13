import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./postSlice";
import profileReducer from "./profileSlice";
import groupReducer from "./groupSlice";
import modalPostReducer from "./modalPostSlice";
const rootReducer = {
  posts: postReducer,
  profile: profileReducer,
  group: groupReducer,
  modalPost: modalPostReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
