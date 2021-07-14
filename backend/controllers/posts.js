const validator = require("validator");

const Post = require('../models/post');
const throwError = require('./error');

exports.getPosts = async () => {
    const posts = await Post.find({})
        .sort({ createdAt: -1 })
        .populate("userId", ["_id", "name"])
        .populate({
            path:"comments",
            select: "_id content createdAt updatedAt",
            populate: {
                    path: "userId",
                    model: "User",
                    select: "_id name"
                }
        });
    return posts;
}

exports.getOnePost = async ({ id }) => {
    const post = await Post.findById(id)
    .populate("userId", ["_id", "name"])
    .populate({
        path:"comments",
        select: "_id content createdAt updatedAt",
        populate: {
                path: "userId",
                model: "User",
                select: "_id name"
            }
    });;
    if (!post) throwError("Post is not found!", 404);
    return post;
}

exports.createPost = async ({ postInput: { title, content } }, req) => {
    if (!req.userId) throwError("Unauthorized!", 401);

    const errs = [];
    if (validator.isEmpty(title)) errs.push("Missing title!");
    if (validator.isEmpty(content)) errs.push("Missing content!");
    if (errs.length > 0) throwError("Invalid input", 422, errs);
    const imageURL = req.file ? req.file.path : undefined;
    const post = new Post({
        title,
        content,
        imageURL,
        userId: req.userId
    });

    const createdPost = await post.save();
    return createdPost.populate("userId", ["_id", "name"]).execPopulate();
}

exports.updatePost = async ({ id, postInput: { title, content } }, req) => {
    if (!req.userId) throwError("Unauthorized!", 401);
    const post = await Post.findById(id);
    if (!post) throwError("Post is not found!", 404);
    if (post.userId != req.userId) throwError("Forbidden!", 403);
    const errs = [];
    if (validator.isEmpty(title)) errs.push("Missing title!");
    if (validator.isEmpty(content)) errs.push("Missing content!");
    if (errs.length > 0) throwError("Invalid input", 422, errs);

    const imageURL = req.file ? req.file.path : undefined;
    post.title = title;
    post.content = content;
    post.imageURL = imageURL || post.imageURL;
    const updatedPost = await post.save();
    return updatedPost.populate("userId", ["_id", "name"]).execPopulate();
}

exports.deletePost = async ({ id }, req) => {
    if (!req.userId) throwError("Unauthorized!", 401);
    const post = await Post.findById(id);
    if (!post) throwError("Post is not found!", 404);
    if (post.userId != req.userId) throwError("Forbidden!", 403);
    await post.deleteOne();
    return post;
}

exports.togglePostlike = async ({ id }, req) => {
    if (!req.userId) throwError("Unauthorized!", 401);
    const post = await Post.findById(id);
    if (!post) throwError("Post is not found!", 404);
    post.likes = post.likes.find(userId => userId == req.userId) ?
        post.likes.filter(userId => userId != req.userId) : post.likes.concat(req.userId);
    await post.save();
    return post.populate("userId", ["_id", "name"]).execPopulate();
}