const asyncHandler = require('express-async-handler');
const Review = require('../models/Review.js');
const Hairstyle = require('../models/Hairstyle.js');

// @desc    Create a new review
// @route   POST /api/hairstyles/:id/reviews
const createHairstyleReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const hairstyleId = req.params.id;

  const hairstyle = await Hairstyle.findById(hairstyleId);

  if (hairstyle) {
    // เช็คว่า user เคยรีวิวทรงผมนี้ไปแล้วหรือยัง
    const alreadyReviewed = await Review.findOne({
        hairstyle: hairstyleId,
        user: req.user._id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this hairstyle');
    }

    const review = new Review({
      rating: Number(rating),
      comment,
      user: req.user._id,
      hairstyle: hairstyleId,
    });

    const createdReview = await review.save();

    // อัปเดตคะแนนเฉลี่ยใน Hairstyle document
    const allReviews = await Review.find({ hairstyle: hairstyleId });
    hairstyle.reviews.push(createdReview._id);
    hairstyle.numReviews = allReviews.length;
    hairstyle.averageRating =
      allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    await hairstyle.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Hairstyle not found');
  }
});

// @desc    Get reviews for a hairstyle
// @route   GET /api/hairstyles/:id/reviews
const getHairstyleReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ hairstyle: req.params.id }).populate('user', 'username profileImageUrl');
    res.json(reviews);
});

module.exports = { createHairstyleReview, getHairstyleReviews };