const mongoose = require('mongoose');

const hairstyleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrls: [{ type: String, required: true }],
  tags: [{ type: String }],
  suitableFaceShapes: [{ type: String }],
  gender: {
    type: String,
    required: true,
    enum: ['ชาย', 'หญิง', 'Unisex'], // กำหนดให้ใส่ได้แค่ 3 ค่านี้
  },
  averageRating: { // คะแนนเฉลี่ย
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: { // จำนวนรีวิวทั้งหมด
    type: Number,
    required: true,
    default: 0,
  },
}, { timestamps: true });

const Hairstyle = mongoose.model('Hairstyle', hairstyleSchema);
module.exports = Hairstyle;