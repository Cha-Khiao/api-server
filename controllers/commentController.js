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
    const comment = new Comment({ text, author: req.user._id, post: postId });
    const createdComment = await comment.save();

    // --- ✨ เพิ่ม Logic อัปเดตจำนวนคอมเมนต์ ✨ ---
    post.commentCount = (post.commentCount || 0) + 1;
    await post.save();
    // ------------------------------------------

    const populatedComment = await Comment.findById(createdComment._id).populate('author', 'username profileImageUrl');
    res.status(201).json(populatedComment);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Get all top-level comments for a post with replies
// @route   GET /api/posts/:postId/comments
const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId, parentComment: null })
    .populate('author', 'username profileImageUrl')
    .populate({
      path: 'replies',
      populate: { path: 'author', select: 'username profileImageUrl' }
    });
  res.json(comments);
});

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
      post: parentComment.post,
      parentComment: parentCommentId,
    });
    const createdReply = await reply.save();
    parentComment.replies.push(createdReply._id);
    await parentComment.save();
    const populatedReply = await Comment.findById(createdReply._id).populate('author', 'username profileImageUrl');
    res.status(201).json(populatedReply);
  } else {
    res.status(404);
    throw new Error('Parent comment not found');
  }
});

// @desc    Update a comment
// @route   PUT /api/comments/:commentId
const updateComment = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.commentId);

    if (comment) {
        if (!comment.author.equals(req.user._id)) {
            res.status(401);
            throw new Error('User not authorized');
        }
        comment.text = text || comment.text;
        await comment.save();

        // --- ✨ แก้ไขส่วนนี้ให้มีการ Populate ซ้อนกัน ✨ ---
        const updatedComment = await Comment.findById(comment._id)
            .populate('author', 'username profileImageUrl')
            .populate({
                path: 'replies',
                populate: {
                    path: 'author',
                    select: 'username profileImageUrl'
                }
            });

        res.json(updatedComment);
    } else {
        res.status(404);
        throw new Error('Comment not found');
    }
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);

    if (comment) {
        const post = await Post.findById(comment.post);
        if (!comment.author.equals(req.user._id) && !post.author.equals(req.user._id) && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('User not authorized');
        }
        if (comment.parentComment) {
            await Comment.findByIdAndUpdate(comment.parentComment, {
                $pull: { replies: comment._id }
            });
        }
        await comment.deleteOne();
        res.json({ message: 'Comment removed' });
    } else {
        res.status(404);
        throw new Error('Comment not found');
    }
});

module.exports = {
  createComment,
  getComments,
  replyToComment,
  updateComment,
  deleteComment,
};