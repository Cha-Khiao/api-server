const mongoose = require('mongoose');

const hairstyleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrls: [{ type: String, required: true }],
    tags: [{ type: String }],
    suitableFaceShapes: [{ type: String }],
    gender: {
      type: String,
      required: true,
      enum: ['ชาย', 'หญิง', 'Unisex'],
    },
    // --- เพิ่มฟิลด์เหล่านี้เข้ามา ---
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    averageRating: {
      type: Number,
      required: true,
      default: 0,
    },
    // ------------------------------
  },
  { timestamps: true }
);

const Hairstyle = mongoose.model('Hairstyle', hairstyleSchema);
module.exports = Hairstyle;