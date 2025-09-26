// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 }, // คะแนน 1-5 ดาว
  comment: { type: String, required: false }, // ความคิดเห็น (ไม่บังคับ)
  user: { // คนที่รีวิว
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  hairstyle: { // ทรงผมที่ถูกรีวิว
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Hairstyle',
  },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;