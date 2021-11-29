import baseApi from "../base.api";
import { paths } from "../paths";

export const getPostList = (data) => {
    return baseApi.get(paths.getPostList(data));
};

export const createPost = (post) => {
    return baseApi.get(paths.createPost(),post);
};

export const deletePost = (postId) => {
    return baseApi.get(paths.deletePost(postId));
};
