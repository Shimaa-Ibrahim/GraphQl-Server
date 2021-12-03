const auth = require('../controllers/auth');
const posts = require('../controllers/posts');
const comments = require('../controllers/comments');

module.exports = {
    register: auth.register,
    login: auth.login,
    refreshToken: auth.refreshToken,
    logout: auth.logout,

    createPost: posts.createPost,
    posts: posts.getPosts,
    post: posts.getOnePost,
    updatePost: posts.updatePost,
    deletePost: posts.deletePost,
    toggleLike: posts.togglePostlike,

    addComment: comments.addComment,
    updateComment: comments.updateComment,
    deleteComment: comments.deleteComment,
};
