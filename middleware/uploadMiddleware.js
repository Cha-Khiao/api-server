const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cut-match-profiles', // ชื่อโฟลเดอร์ใน Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    // public_id: (req, file) => 'some_unique_name', // (optional)
  },
});

const upload = multer({ storage: storage });

module.exports = upload;