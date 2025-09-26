const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// ฟังก์ชันสร้าง Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('อีเมลนี้มีผู้ใช้งานแล้ว');
  }

  const user = await User.create({ username, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('ไม่พบผู้ใช้งาน');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.file) {
      // Assuming multer-storage-cloudinary gives the path as the URL
      user.profileImageUrl = req.file.path;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
        _id: updatedUser._id,
       username: updatedUser.username,
       email: updatedUser.email,
       role: updatedUser.role,
       profileImageUrl: updatedUser.profileImageUrl,
       token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('ไม่พบผู้ใช้งาน');
  }
});

// @desc    Delete user profile
// @route   DELETE /api/users/profile
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'บัญชีผู้ใช้ถูกลบแล้ว' });
  } else {
    res.status(404);
    throw new Error('ไม่พบผู้ใช้งาน');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
};