const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const protect = async (req, res, next) => {
  console.log('--- 🛡️ ยาม Protect เริ่มทำงาน ---');
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      console.log('1. พบ Token ใน Header');
      token = req.headers.authorization.split(' ')[1];

      console.log('2. กำลังตรวจสอบความถูกต้องของ Token...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('3. Token ถูกต้อง! User ID คือ:', decoded.id);

      console.log('4. กำลังค้นหาข้อมูล User ในฐานข้อมูล...');
      req.user = await User.findById(decoded.id).select('-password');
      console.log('5. พบข้อมูล User:', req.user.username);

      next(); // 🚀 สำคัญที่สุด: อนุญาตให้ไปต่อ!
      console.log('6. ส่งต่อไปยัง Controller เรียบร้อย');

    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาดใน Middleware:', error.message);
      res.status(401).json({ message: 'ไม่ได้รับอนุญาต, token มีปัญหา' });
    }
  }

  if (!token) {
    console.log('❌ ไม่พบ Token ใน Header');
    res.status(401).json({ message: 'ไม่ได้รับอนุญาต, ไม่มี token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };