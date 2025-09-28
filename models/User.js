const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profileImageUrl: {
    type: String,
    default: '',
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hairstyle'
  }], // <-- ✨ เพิ่ม comma ที่นี่
  savedLooks: [{ 
    type: String 
  }], // <-- ✨ เพิ่ม comma ที่นี่ (ถ้ามี field ต่อไป)
  followers: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'User' 
  }],
  following: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'User' 
  }],
  
}, { timestamps: true });

// เข้ารหัสรหัสผ่านก่อนบันทึก
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// method สำหรับเปรียบเทียบรหัสผ่าน
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;