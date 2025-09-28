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
      profileImageUrl: user.profileImageUrl,
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
      profileImageUrl: user.profileImageUrl,
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
            profileImageUrl: user.profileImageUrl
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

// --- FAVORITES CONTROLLERS ---

// @desc    Get user's favorite hairstyles
// @route   GET /api/users/favorites
const getFavoriteHairstyles = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  if (user) {
    res.json(user.favorites);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add hairstyle to favorites
// @route   POST /api/users/favorites
const addFavoriteHairstyle = asyncHandler(async (req, res) => {
  const { hairstyleId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    if (!user.favorites.includes(hairstyleId)) {
      user.favorites.push(hairstyleId);
      await user.save();
    }
    res.status(200).json({ message: 'Added to favorites' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Remove hairstyle from favorites
// @route   DELETE /api/users/favorites/:id
const removeFavoriteHairstyle = asyncHandler(async (req, res) => {
  const hairstyleId = req.params.id;
  const user = await User.findById(req.user._id);

  if (user) {
    user.favorites.pull(hairstyleId); // .pull is a mongoose helper
    await user.save();
    res.status(200).json({ message: 'Removed from favorites' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Upload a saved look image and add URL to user profile
// @route   POST /api/users/saved-looks
const addSavedLook = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        if (req.file) {
            user.savedLooks.push(req.file.path); // req.file.path คือ URL จาก Cloudinary
            await user.save();
            res.status(201).json({
                message: 'Look saved successfully',
                savedLooks: user.savedLooks
            });
        } else {
            res.status(400);
            throw new Error('No image file provided');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all saved looks for a user
// @route   GET /api/users/saved-looks
const getSavedLooks = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json(user.savedLooks);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete a saved look
// @route   DELETE /api/users/saved-looks
const deleteSavedLook = asyncHandler(async (req, res) => {
    const { imageUrl } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        user.savedLooks.pull(imageUrl); // .pull คือคำสั่งของ Mongoose เพื่อลบ item ออกจาก array
        await user.save();
        res.json({ message: 'Look deleted successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getFavoriteHairstyles,
  addFavoriteHairstyle,
  removeFavoriteHairstyle,
  addSavedLook,
  getSavedLooks,
  deleteSavedLook
};