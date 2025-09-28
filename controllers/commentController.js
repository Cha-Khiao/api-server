const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment.js');
const Post = require('../models/Post.js');

// @desc    Create a new comment on a post
// @route   POST /api/posts/:postId/comments
const createComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (post) {
    const comment = new Comment({
      text,
      author: req.user._id,
      post: postId,
    });

    const createdComment = await comment.save();
    res.status(201).json(createdComment);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// --- ✨ แก้ไขฟังก์ชัน getComments ✨ ---
// @desc    Get all top-level comments for a post with replies
// @route   GET /api/posts/:postId/comments
const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ 
      post: postId,
      parentComment: null // ดึงเฉพาะคอมเมนต์หลัก (ที่ไม่มีพ่อ)
  })
  .populate('author', 'username profileImageUrl')
  .populate({ // ดึงข้อมูล replies ซ้อนเข้าไป
      path: 'replies',
      populate: { // ดึงข้อมูล author ของ replies อีกที
          path: 'author',
          select: 'username profileImageUrl'
      }
  });

  res.json(comments);
});

// --- ✨ เพิ่มฟังก์ชันใหม่สำหรับ Reply ✨ ---
// @desc    Reply to a comment
// @route   POST /api/comments/:id/reply
const replyToComment = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const parentCommentId = req.params.id;

    const parentComment = await Comment.findById(parentCommentId);

    if (parentComment) {
        const reply = new Comment({
            text,
            author: req.user._id,
            post: parentComment.post, // ใช้ postId จาก parent
            parentComment: parentCommentId,
        });

        const createdReply = await reply.save();

        // เพิ่ม ID ของ reply เข้าไปใน parent comment
        parentComment.replies.push(createdReply._id);
        await parentComment.save();

        res.status(201).json(createdReply);
    } else {
        res.status(404);
        throw new Error('Parent comment not found');
    }
});

module.exports = {
  createComment,
  getComments,
  replyToComment,
};