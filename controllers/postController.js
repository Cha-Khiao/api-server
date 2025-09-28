const asyncHandler = require('express-async-handler');
const Post = require('../models/Post.js');
const User = require('../models/User.js');
const Comment = require('../models/Comment.js');

// @desc    Create a new post
const createPost = asyncHandler(async (req, res) => {
  const { text, linkedHairstyle } = req.body;
  const newPostData = { author: req.user._id, text: text };
  if (req.file) newPostData.imageUrl = req.file.path;
  if (linkedHairstyle) newPostData.linkedHairstyle = linkedHairstyle;
  
  const post = await Post.create(newPostData);
  const createdPost = await Post.findById(post._id).populate('author', 'username profileImageUrl');
  res.status(201).json(createdPost);
});

// @desc    Get user's timeline feed
const getFeed = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  const userIds = [...currentUser.following, req.user._id];
  const posts = await Post.find({ author: { $in: userIds } })
    .sort({ createdAt: -1 })
    .populate('author', 'username profileImageUrl')
    .populate('linkedHairstyle', 'name imageUrls');
  res.json(posts);
});

// @desc    Get posts by a specific user
const getUserPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ author: req.params.userId })
        .sort({ createdAt: -1 })
        .populate('author', 'username profileImageUrl')
        .populate('linkedHairstyle', 'name imageUrls');
    res.json(posts);
});

// @desc    Update a post
const updatePost = asyncHandler(async (req, res) => {
  const { text, linkedHairstyle } = req.body;
  const post = await Post.findById(req.params.id);

  if (post) {
    if (!post.author.equals(req.user._id)) {
      res.status(401);
      throw new Error('User not authorized to update this post');
    }
    post.text = text !== undefined ? text : post.text;
    post.linkedHairstyle = linkedHairstyle !== undefined ? linkedHairstyle : post.linkedHairstyle;
    await post.save();

    // --- ✨ แก้ไขส่วนนี้ ✨ ---
    const updatedPost = await Post.findById(post._id)
        .populate('author', 'username profileImageUrl')
        .populate('linkedHairstyle', 'name imageUrls');
    
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Like or unlike a post
const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    if (post.likes.includes(req.user._id)) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();

    // --- ✨ แก้ไขส่วนนี้ ✨ ---
    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username profileImageUrl')
      .populate('linkedHairstyle', 'name imageUrls');

    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete a post
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    if (!post.author.equals(req.user._id)) {
      res.status(401);
      throw new Error('User not authorized');
    }
    await Comment.deleteMany({ post: post._id });
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
  updatePost,
  likePost,
  deletePost,
};