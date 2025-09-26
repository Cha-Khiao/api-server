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
  // ✨ เพิ่มฟิลด์นี้เข้ามา ✨
  profileImageUrl: {
    type: String,
    default: '', // ค่าเริ่มต้นเป็นสตริงว่าง
  },
  
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hairstyle' // สำคัญมาก: เป็นการบอกว่า ID ใน Array นี้อ้างอิงถึงข้อมูลใน Model 'Hairstyle'
  }]
}, { timestamps: true });

// เข้ารหัสรหัสผ่านก่อนบันทึก
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
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