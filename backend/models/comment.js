const mongoose = require('mongoose');

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

module.exports = mongoose.model("Comment", commentSchema);