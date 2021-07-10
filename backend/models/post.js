const mongoose = require("mongoose");

const User = require('./user');

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    imageURL: {
      type: String
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  { timestamps: true }
);

postSchema.pre('save', async function () {
  await User.updateOne({_id: this.userId}, {$push: {posts: this._id}});
});

module.exports = mongoose.model("Post", postSchema);
