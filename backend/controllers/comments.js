const validator = require("validator");

const Comment = require('../models/comment');
const Post = require('../models/post');
const throwError = require('./error');


exports.addComment = async ({ commentInput: { content, postId } }, req) => {
    if (!req.userId) throwError("Unauthorized!", 401);
    const post = await Post.findById(postId);
    if (!post) throwError("Post is not found!", 404);
    if (validator.isEmpty(content)) throwError("Missing content!", 422);
    const comment = new Comment({
        content,
        postId,
        userId: req.userId
    });

    const createdComment = await comment.save();
    return createdComment.populate('userId', ['_id', 'name']).execPopulate();
}

exports.updateComment = async ({ id, commentInput: { postId, content } }, req) => {
    if (!req.userId) throwError("Unauthorized!", 401);
    const post = await Post.findById(postId);
    if (!post) throwError("Post is not found!", 404);
    const comment = await Comment.findById(id);
    if (!comment) throwError("Comment is not found!", 404);
    if (comment.userId != req.userId) throwError("Forbidden!", 403);
    if (validator.isEmpty(content)) throwError("Missing content!", 422);

    comment.content = content;
    const updatedComment = await comment.save();
    return updatedComment.populate("userId", ["_id", "name"]).execPopulate();
}


exports.deleteComment = async ({ id }, req) => {
    if (!req.userId) throwError("Unauthorized!", 401);
    const comment = await Comment.findById(id).populate('postId', ['userId']);
    if (!comment) throwError("Comment is not found!", 404);
    if (comment.userId == req.userId || comment.postId.userId == req.userId) {
        await comment.deleteOne();
        return comment;
    } else {
        throwError("Forbidden!", 403);
    }

}
