
import {
  GET_USER_PROFILE,
  GET_MY_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  FRIEND_REQUEST_SUCCESS,
  FRIEND_REQUEST_RESPONE_SUCCESS,
  GET_FRIEND_REQUEST_SUCCESS,
  UNFRIEND_SUCCESS,
  GET_IMAGE_USE_SUCCESS
} from "store/user/user.constant";


export const getUserProfileAction = (data) => {
  return { type: GET_USER_PROFILE, payload: data };
};
export const getMyProfileAction = (data) => {
  return { type: GET_MY_PROFILE, payload: data };
};
// UPDATE USER
export const updateProfileAction = (data) => {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    payload: data,
  };
};

export const friendRequestAction = (data) => {
  return (dispatch, getState) => {
    const profile = getState().userReducer.profileCurentUser;
    return {
      type: FRIEND_REQUEST_SUCCESS,
      payload: {
        ...data,
        user: { _id: profile._id },
        createAt: Date.now(),
      },
    }
  };
};
// export const friendRequestRespone = (data) => {
//   return async (dispatch) => {
//     try {
//       const res = await axios.post(
//         `${HTTP_CONNECT}/users/friendRespone`,
//         data,
//         config
//       );
//       if (res.status == 200) {
//         await dispatch(getUserCurrentProfile());
//       }
//     } catch (err) {
//       dispatch(setNotify(err.response));
//     }
//   };
// };

export const unfriendSuccessAction = (data) => {
  return {
    type: UNFRIEND_SUCCESS,
    payload: data,
  };
};


export const getFriendsRequestAcion = (data) => {
  return {
    type: GET_FRIEND_REQUEST_SUCCESS,
    payload: data,
  };
};
export const friendRequestResponeAction = (data) => {
  return {
    type: FRIEND_REQUEST_RESPONE_SUCCESS,
    payload: data,
  };
};

export const getImageUserSuccess = (data)=>{
  return{
    type:GET_IMAGE_USE_SUCCESS,
    payload:data
  }
}