const validator = require("validator");

const Post = require('../models/post');

exports.createPost = async ({ postInput: { title, content } }, req) => {
    if(!req.userId) {
        const err = new Error("Unauthorized!");
        err.code = 401;
        throw err;
    }
    const errs = [];
    if (validator.isEmpty(title)) errs.push("Missing title!");
    if (validator.isEmpty(content)) errs.push("Missing content!");
    if (errs.length > 0) {
        const err = new Error("Invalid input");
        err.data = errs;
        err.code = 422;
        throw err;
    }
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