import { createSlice } from "@reduxjs/toolkit";

const profile = createSlice({
  name: "profile",
  initialState: {
   
  },
  reducers: {
    setProfile: (state, action) => {
      state = action.payload;
      return state;
    },
    editProfile: (state, action) => {
      const { coverPicture, avatar, fullName, email, dateOfBirth } =
        action.payload;
      state = { ...state, coverPicture, avatar, fullName, email, dateOfBirth };
      return state;
    },
    friendRequestRespone:(state,action)=>{
      return async (dispatch) => {
        try {
          const res = await axios.post(
            `${HTTP_CONNECT}/users/friendRespone`,
            data,
            config
          );
          if (res.status == 200) {
            await dispatch(getUserCurrentProfile());
          }
        } catch (err) {
          dispatch(setNotify(err.response));
        }
      };
    }
  },
});

const { reducer, actions } = profile;
export const { setProfile, editProfile } = actions;
export default reducer;
