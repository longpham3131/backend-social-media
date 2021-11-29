export const paths = {
  getPostList(data) {
    return `/post?limitPost=${data.limitPost}&index=${data.index}&profile=${data.profile}&userId=${data.userId}`;
  },
  createPost() {
    return `/post`;
  },
  deletePost(postId) {
    return `/post/delete/${postId}`;
  },
};
