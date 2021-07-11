const validator = require("validator");

const Post = require('../models/post');

function throwError(message, code, data=null) {
    const err = new Error(message);
    err.code = code;
    err.data = data;
    return err;
}

exports.getPosts = async () => {
    const posts = await Post.find({})
    .sort({createdAt: -1})
    .populate("userId", ["_id", "name"]);
    return posts;
}

exports.getOnePost = async ({ id }) => {
    const post = await Post.findById(id).populate("userId", ["_id", "name"]);
    if(!post) throw throwError("Post is not found!", 404);
    return post;
}

exports.createPost = async ({ postInput: { title, content } }, req) => {
    if(!req.userId) throw throwError("Unauthorized!", 401);
    
    const errs = [];
    if (validator.isEmpty(title)) errs.push("Missing title!");
    if (validator.isEmpty(content)) errs.push("Missing content!");
    if (errs.length > 0) throw throwError("Invalid input", 422, errs);
    const imageURL = req.file? req.file.path : undefined;
    const post = new Post({
        title,
        content,
        imageURL,
        userId: req.userId
    });

    const createdPost = await post.save();
    return createdPost.populate("userId", ["_id", "name"]).execPopulate();
}

exports.updatePost = async ({id, postInput: {title, content}}, req) => {
    if(!req.userId) throw throwError("Unauthorized!", 401);
    const post = await Post.findById(id);
    if(!post)  throw throwError("Post is not found!", 404);
    if (post.userId != req.userId)  throw throwError("Forbidden!", 403);
    const errs = [];
    if (validator.isEmpty(title)) errs.push("Missing title!");
    if (validator.isEmpty(content)) errs.push("Missing content!");
    if (errs.length > 0) throw throwError("Invalid input", 422, errs);

    const imageURL = req.file? req.file.path : undefined;
    post.title = title;
    post.content = content;
    post.imageURL = imageURL || post.imageURL;
    const updatedPost = await post.save();
    return updatedPost.populate("userId", ["_id", "name"]).execPopulate();
}

exports.deletePost = async ({id}, req) => {
    if(!req.userId) throw throwError("Unauthorized!", 401);
    const post = await Post.findById(id);
    if(!post)  throw throwError("Post is not found!", 404);
    if (post.userId != req.userId)  throw throwError("Forbidden!", 403);
    await post.deleteOne();
    return post;

}