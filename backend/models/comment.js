const mongoose = require('mongoose');

const Post = require('./post');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    }
},
    { timestamps: true }
);

commentSchema.pre('save', async function () {
    await Post.updateOne({_id: this.postId}, {$push: {comments: this._id}});
  });
  
commentSchema.pre('deleteOne', { document: true }, async function () {
    await Post.updateOne({_id: this.postId}, {$pull: {comments: this._id}});
  });

module.exports = mongoose.model("Comment", commentSchema);