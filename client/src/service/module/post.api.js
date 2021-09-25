import baseApi from "../base.api";
import { paths } from "../paths";

export const getPostList = (limit) => {
    return baseApi.get(paths.getPostList(limit));
};

export const createPost = (post) => {
    return baseApi.get(paths.createPost(),post);
};

export const deletePost = (postId) => {
    return baseApi.get(paths.deletePost(postId));
};
