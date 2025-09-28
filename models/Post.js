const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    linkedHairstyle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hairstyle',
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;