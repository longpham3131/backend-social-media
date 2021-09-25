export const paths = {
  getPostList(limit) {
    return `/post?limitPost=${limit}`;
  },
  createPost() {
    return `/post`;
  },
  deletePost(postId) {
    return `/post/delete/${postId}`;
  },
};
