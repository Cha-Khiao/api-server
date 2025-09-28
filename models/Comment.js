const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    text: { type: String, required: true },
    // --- ✨ เพิ่ม 2 ฟิลด์นี้เข้ามา ✨ ---
    parentComment: { // คอมเมนต์นี้เป็นลูกของใคร (ถ้าเป็น null คือคอมเมนต์หลัก)
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    replies: [{ // คอมเมนต์นี้มีลูกกี่คน
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    }],
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;