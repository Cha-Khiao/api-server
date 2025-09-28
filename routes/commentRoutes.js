const express = require('express');
const router = express.Router({ mergeParams: true }); 
const {
  createComment,
  getComments,
  replyToComment,
} = require('../controllers/commentController.js');
const { protect } = require('../middleware/authMiddleware.js');

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - userId
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the comment
 *         postId:
 *           type: string
 *           description: The ID of the post the comment belongs to
 *         userId:
 *           type: string
 *           description: The ID of the user who made the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the comment was last updated
 */

/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: Comment management (create, get, reply)
 */

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   get:
 *     summary: Get all comments for a specific post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to get comments for
 *         example: 60d2b3f04f1a2d001fbc2e7d
 *     responses:
 *       200:
 *         description: A list of comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a specific post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *                 example: "This is a great post!"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Bad request (e.g., missing content)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /api/posts/{postId}/comments/{id}/reply:
 *   post:
 *     summary: Reply to a specific comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post the comment belongs to
 *         example: 60d2b3f04f1a2d001fbc2e7d
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to reply to
 *         example: 60d2b3f04f1a2d001fbc2e7e
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the reply
 *                 example: "I agree with your point!"
 *     responses:
 *       201:
 *         description: Reply added successfully
 *       400:
 *         description: Bad request (e.g., missing content)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment or Post not found
 */

router.route('/')
  .post(protect, createComment)
  .get(protect, getComments);

router.route('/:id/reply')
  .post(protect, replyToComment);

module.exports = router;
