import {
  CLEAR_NOTIFY,
  GET_USER_PROFILE,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_SUCCESS,
  GET_USER_CURRENT_PROFILE,
  FRIEND_REQUEST_SUCCESS,
  FRIEND_REQUEST_RESPONE_SUCCESS,
  GET_FRIEND_REQUEST_SUCCESS,
  UNFRIEND_SUCCESS,
  GET_IMAGE_USE_SUCCESS
} from "./user.constant";

const initialState = {
  profile: {},
  profileCurentUser: {},
  friendsRequest: [],
  imagesUser: [],
};
export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USER_PROFILE:
      return { ...state, profile: payload.data };
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, profile: payload.data };
    case UPDATE_PROFILE_FAIL:
      return { ...state };
    case GET_USER_CURRENT_PROFILE:
      return {
        ...state,
        profileCurentUser: payload.data,
        friendsRequest: payload.data.friendsRequest,
      };
    case FRIEND_REQUEST_SUCCESS:
      let newFriendsRequest = { ...state.profile };
      if (payload.type == 0) {
        newFriendsRequest.friendsRequest = state.profile.friendsRequest.filter(
          (e) => e.user._id != payload.user._id
        );
      }
      if (payload.type == 1)
        newFriendsRequest.friendsRequest = [
          ...state.profile.friendsRequest,
          payload,
        ];
      return { ...state, profile: newFriendsRequest };
    case GET_FRIEND_REQUEST_SUCCESS:
      return { ...state, friendsRequest: payload.data };
    case UNFRIEND_SUCCESS:
      let newProfile = { ...state.profile };
      newProfile.friends = newProfile.friends.filter(
        (e) => e.user._id !== state.profileCurentUser._id
      );
      return { ...state, profile: newProfile };
    case GET_IMAGE_USE_SUCCESS:
      return { ...state, imagesUser: payload.data };
    default:
      return state;
  }
};
