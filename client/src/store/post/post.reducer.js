import {
  CREATE_POST_SUCCESS,
  CREATE_POST_FAIL,
  EDIT_POST_SUCCESS,
  EDIT_POST_FAIL,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAIL,
  GET_POST_LIST,
  LIKE_POST_SUCCESS,
  GET_COMMENT_SUCCESS,
  DELETE_COMMENT_SUCCESS,
  EDIT_COMMENT_SUCCESS,
  POST_COMMENT_SUCCESS,
  LIKE_COMMENT_SUCCESS,
} from "store/post/post.constant";

const initialState = {
  postList: [],
  notify: null,
};

export const postReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_POST_LIST:
      console.log(payload);
      return { ...state, postList: payload };
    //CREATE
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        postList: [payload.data, ...state.postList],
      };
    case CREATE_POST_FAIL:
      return {
        ...state,
      };
    //EDIT
    case EDIT_POST_SUCCESS:
      return {
        ...state,
        postList: state.postList.map((post) => {
          if (post._id === payload.data._id) {
            post = payload.data;
          }
          return post;
        }),
      };
    case EDIT_POST_FAIL:
      return {
        ...state,
      };
    //DELETE
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        postList: state.postList.filter(
          (post) => post._id !== payload.data.postId
        ),
      };
    case DELETE_POST_FAIL:
      return {
        ...state,
      };
    case LIKE_POST_SUCCESS:
      const { like, user, postId } = payload;
      let listNewPosts = state.postList.map((post) => {
        if (postId === post._id) {
          if (like) {
            post.like.push({ user: user });
          } else {
            post.like = post.like.filter((item) => item.user._id !== user._id);
          }
        }
        return post;
      });
      return {
        ...state,
        postList: listNewPosts,
      };
    case POST_COMMENT_SUCCESS:
      let newListPost = state.postList;
      newListPost = newListPost.map((post) => {
        if (post._id !== payload.req.postId) return post;
        // post.comments.reverse()
        post.comments = [
          {
            ...payload.res.data,
            user: {
              avatar: payload.user.avatar,
              fullname: payload.user.fullname,
              _id: payload.user._id,
              username: payload.user.username,
            },
          },
          ...post.comments,
        ];
        // post.comments.reverse()
        return post;
      });
      return { ...state, postList: newListPost };
    case LIKE_COMMENT_SUCCESS:
      console.log("LIKE_COMMENT_SUCCESS")
      let newListPost5 = state.postList;
      newListPost5 = newListPost5.map((post) => {
        if (post._id !== payload.req.postId) return post;
        // post.comments.reverse()
        post.comments.map((comment) => {
          if (comment._id !== payload.req.commentId) return comment;
          if (payload.req.type == 1) {
            comment.like.push({
              user: {
                avatar: payload.user.avatar,
                fullname: payload.user.fullname,
                _id: payload.user._id,
                username: payload.user.username,
              },
              createAt: payload.res.data.createAt,
              _id: payload.res.data._id,
            });
          }
          if (payload.req.type == 0) {
            comment.like = comment.like.filter(
              (like) => like.user._id !== payload.user._id
            );
          }
          return comment;
        });
        return post;
      });
      return { ...state, postList: newListPost5 };
    case GET_COMMENT_SUCCESS:
      const newListPost2 = { ...state.postList };
      newListPost2 = newListPost2.map((post) => {
        if (post._id !== payload.req.postId) return post;

        post.comments = [...post.comments, ...payload.res.data];
        return post;
      });
      return { ...state, postList: newListPost2 };
    case EDIT_COMMENT_SUCCESS:
      const newListPost3 = { ...state.postList };
      newListPost3 = newListPost3.map((post) => {
        if (post._id !== payload.req.postId) return post;

        post.comments = post.comments.map((item) => {
          if (item._id !== payload.req.commentId) return item;
          return payload.res.data;
        });
        return post;
      });
      return { ...state, postList: newListPost3 };
    case DELETE_COMMENT_SUCCESS:
      const newListPost4 = { ...state.postList };
      newListPost4 = newListPost4.map((post) => {
        if (post._id !== payload.req.postId) return post;

        post.comments = post.comments.filter((item) => {
          return item._id !== payload.req.commentId;
        });
        return post;
      });
      return { ...state, postList: newListPost4 };
    default:
      return state;
  }
};
