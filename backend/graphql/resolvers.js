const auth = require('../controllers/auth');
const posts = require('../controllers/posts');
module.exports = {
    register: auth.register,
    login: auth.login,
    createPost: posts.createPost,
    posts: posts.getPosts,
    post: posts.getOnePost,
    
};
