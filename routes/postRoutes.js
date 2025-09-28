const express = require('express');
const router = express.Router();
const commentRouter = require('./commentRoutes.js'); // <-- ✨ 1. Import เข้ามา

const {
  createPost,
  getFeed,
  getUserPosts,
  likePost,
  deletePost,
} = require('../controllers/postController.js');
const { protect } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/uploadMiddleware.js');

// --- ✨ 2. เชื่อม Comment Routes เข้ามา ✨ ---
// บอกให้ใช้ commentRouter เมื่อเจอ path ที่ขึ้นต้นด้วย /:postId/comments
router.use('/:postId/comments', commentRouter);

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - userId
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the post
 *         userId:
 *           type: string
 *           description: The ID of the user who created the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         postImage:
 *           type: string
 *           format: binary
 *           description: The image associated with the post (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the post was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the post was last updated
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
 *   - name: Posts
 *     description: Post creation, feed, and interaction (like, delete)
 *   - name: Comments
 *     description: Post comments management
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the post
 *                 example: "This is my first post!"
 *               postImage:
 *                 type: string
 *                 format: binary
 *                 description: Image associated with the post (optional)
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request (e.g., missing content or invalid file)
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/posts/feed:
 *   get:
 *     summary: Get the logged-in user's feed (all posts)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of posts from the feed
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/posts/user/{userId}:
 *   get:
 *     summary: Get posts of a specific user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose posts to retrieve
 *         example: 60d2b3f04f1a2d001fbc2e7d
 *     responses:
 *       200:
 *         description: List of posts by the user
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/posts/{id}/like:
 *   post:
 *     summary: Like a specific post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to like
 *         example: 60d2b3f04f1a2d001fbc2e7d
 *     responses:
 *       200:
 *         description: Successfully liked the post
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a specific post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to be deleted
 *         example: 60d2b3f04f1a2d001fbc2e7d
 *     responses:
 *       200:
 *         description: Successfully deleted the post
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
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
 *         description: List of comments for the post
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
 *                 example: "Great post!"
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
 * /api/posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a specific comment on a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to be deleted
 *     responses:
 *       200:
 *         description: Successfully deleted the comment
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment or Post not found
 */

router.route('/')
  .post(protect, upload.single('postImage'), createPost);

router.route('/feed')
  .get(protect, getFeed);

router.route('/user/:userId')
  .get(protect, getUserPosts);

router.route('/:id/like')
  .post(protect, likePost);

router.route('/:id')
  .delete(protect, deletePost);

module.exports = router;
