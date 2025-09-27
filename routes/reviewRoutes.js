const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createHairstyleReview,
  getHairstyleReviews,
} = require('../controllers/reviewController.js');
const { protect } = require('../middleware/authMiddleware.js');

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         rating:
 *           type: number
 *           description: The rating given by the user (1-5).
 *           example: 5
 *         comment:
 *           type: string
 *           description: The review comment.
 *           example: "ทรงนี้ตัดแล้วสวยมากครับ"
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             username:
 *               type: string
 *           description: The user who wrote the review.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the review was created.
 *     ReviewBody:
 *       type: object
 *       required:
 *         - rating
 *         - comment
 *       properties:
 *         rating:
 *           type: number
 *           example: 4
 *         comment:
 *           type: string
 *           example: "ชอบมากครับ แต่ต้องเซ็ตผมนิดหน่อย"
 */

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Review management for hairstyles
 */

/**
 * @swagger
 * /api/hairstyles/{id}/reviews:
 *   get:
 *     summary: Get all reviews for a specific hairstyle
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the hairstyle
 *     responses:
 *       200:
 *         description: A list of reviews for the hairstyle
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: Hairstyle not found
 *   post:
 *     summary: Create a new review for a hairstyle
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the hairstyle to review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewBody'
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Bad request (e.g., user already reviewed)
 *       401:
 *         description: Unauthorized (user not logged in)
 *       404:
 *         description: Hairstyle not found
 */

router.route('/')
  .get(getHairstyleReviews)
  .post(protect, createHairstyleReview);

module.exports = router;
