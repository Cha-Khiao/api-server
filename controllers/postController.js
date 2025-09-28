const asyncHandler = require('express-async-handler');
const Post = require('../models/Post.js');
const User = require('../models/User.js');
const Comment = require('../models/Comment.js');

// @desc    Create a new post
// @route   POST /api/posts
const createPost = asyncHandler(async (req, res) => {
  const { text, linkedHairstyle } = req.body;

  const newPostData = {
    author: req.user._id,
    text: text,
  };

  if (req.file) {
    newPostData.imageUrl = req.file.path; // URL from Cloudinary
  }

  if (linkedHairstyle) {
    newPostData.linkedHairstyle = linkedHairstyle;
  }

  const post = await Post.create(newPostData);
  res.status(201).json(post);
});

// @desc    Get user's timeline feed
// @route   GET /api/posts/feed
const getFeed = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);

  // รวม ID ของคนที่เราติดตามและ ID ของเราเอง
  const userIds = [...currentUser.following, req.user._id];

  const posts = await Post.find({ author: { $in: userIds } })
    .sort({ createdAt: -1 }) // เรียงจากใหม่ไปเก่า
    .populate('author', 'username profileImageUrl') // ดึงข้อมูล author
    .populate('linkedHairstyle', 'name imageUrls'); // ดึงข้อมูลทรงผมที่แนบมา

  res.json(posts);
});

// @desc    Get posts by a specific user
// @route   GET /api/posts/user/:userId
const getUserPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ author: req.params.userId })
        .sort({ createdAt: -1 })
        .populate('author', 'username profileImageUrl')
        .populate('linkedHairstyle', 'name imageUrls');
    res.json(posts);
});


// @desc    Like or unlike a post
// @route   POST /api/posts/:id/like
const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.likes.includes(req.user._id)) {
      // ถ้าเคยไลค์แล้ว -> unlike
      post.likes.pull(req.user._id);
    } else {
      // ถ้ายังไม่เคยไลค์ -> like
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    // ตรวจสอบว่าเป็นเจ้าของโพสต์หรือไม่
    if (!post.author.equals(req.user._id)) {
      res.status(401);
      throw new Error('User not authorized to delete this post');
    }

    // ลบคอมเมนต์ทั้งหมดที่เกี่ยวข้องกับโพสต์นี้ก่อน
    await Comment.deleteMany({ post: post._id });
    // จากนั้นลบโพสต์
    await post.deleteOne();

    res.json({ message: 'Post removed' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});


module.exports = {
  createPost,
  getFeed,
  getUserPosts,
  likePost,
  deletePost,
};