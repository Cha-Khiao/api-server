const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

// ฟังก์ชันสร้าง Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'อีเมลนี้มีผู้ใช้งานแล้ว' });
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
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
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
      res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
    // req.user ถูกแนบมาจาก middleware 'protect'
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// ... (ที่ updateUserProfile)
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        // ✨ เพิ่ม Logic จัดการรูปโปรไฟล์ ✨
        if (req.file) {
          // req.file.path จะเป็น 'uploads/profile-1668... .jpg'
          // เราต้องใส่ slash ข้างหน้าเพื่อให้เป็น URL ที่ถูกต้อง
          user.profileImageUrl = `/${req.file.path}`;
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
            profileImageUrl: updatedUser.profileImageUrl, // ส่ง URL รูปกลับไปด้วย
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    }
};

// @desc    Delete user profile
// @route   DELETE /api/users/profile
const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'บัญชีผู้ใช้ถูกลบแล้ว' });
        } else {
            res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
};