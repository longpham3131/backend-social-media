import { createSlice } from "@reduxjs/toolkit";

const group = createSlice({
  name: "group",
  initialState: {},
  reducers: {
    setGroup: (state, action) => {
      state = action.payload;
      return state;
    },
    editGroup: (state, action) => {
      const payload = action.payload;
      state = { ...state, ...payload };
      return state;
    },
  },
});

const { reducer, actions } = group;
export const { setGroup, editGroup } = actions;
export default reducer;
