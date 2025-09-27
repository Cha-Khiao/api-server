const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getFavoriteHairstyles,
  addFavoriteHairstyle,
  removeFavoriteHairstyle,
  addSavedLook,
  getSavedLooks,
  deleteSavedLook
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/uploadMiddleware.js');

// Middleware to handle validation results
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The user's name
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password
 *           example: password123
 *         role:
 *           type: string
 *           description: The user's role (user or admin)
 *           example: user
 *         profileImage:
 *           type: string
 *           format: binary
 *           description: The profile image of the user (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the user profile was last updated
 *     Favorite:
 *       type: object
 *       required:
 *         - userId
 *         - hairstyleId
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user who is adding the favorite
 *           example: 60d2b3f04f1a2d001fbc2e7d
 *         hairstyleId:
 *           type: string
 *           description: The ID of the hairstyle being added to favorites
 *           example: 60d2b3f04f1a2d001fbc2e7e
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the favorite was added
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the favorite was last updated
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User authentication and management
 *   - name: Favorites
 *     description: Manage user favorites (hairstyles)
 *   - name: SavedLooks
 *     description: Manage saved looks (uploaded images)
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (e.g., user already exists)
 */
router.post('/register', [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
  ],
  validateRequest,
  registerUser
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate a user and get a token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  validateRequest,
  loginUser
);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update the logged-in user's profile (with optional image upload)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid file type
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete the logged-in user's account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('profileImage'), updateUserProfile)
  .delete(protect, deleteUserProfile);

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: Get a list of the user's favorite hairstyles
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite hairstyles for the user
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Add a hairstyle to the user's favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Favorite'
 *     responses:
 *       201:
 *         description: Favorite added successfully
 *       400:
 *         description: Bad request (e.g., already added to favorites)
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/favorites/{id}:
 *   delete:
 *     summary: Remove a hairstyle from the user's favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the favorite hairstyle to be removed
 *     responses:
 *       200:
 *         description: Favorite removed successfully
 *       404:
 *         description: Favorite not found
 *       401:
 *         description: Unauthorized
 */
router.route('/favorites')
  .get(protect, getFavoriteHairstyles)
  .post(protect, addFavoriteHairstyle);

router.route('/favorites/:id')
  .delete(protect, removeFavoriteHairstyle);

/**
 * @swagger
 * /api/users/saved-looks:
 *   get:
 *     summary: Get a list of saved looks (images)
 *     tags: [SavedLooks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of saved looks (images)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the saved look
 *                     example: 60d2b3f04f1a2d001fbc2e7d
 *                   imageUrl:
 *                     type: string
 *                     description: The URL of the saved look image
 *                     example: "https://example.com/image.png"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date the saved look was created
 *                     example: "2022-05-18T09:30:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date the saved look was last updated
 *                     example: "2022-05-19T14:25:00Z"
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Add a saved look (image upload)
 *     tags: [SavedLooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               savedLookImage:
 *                 type: string
 *                 format: binary
 *                 description: The saved look image uploaded by the user
 *             required:
 *               - savedLookImage
 *     responses:
 *       201:
 *         description: Saved look added successfully
 *       400:
 *         description: Invalid file type
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete a saved look (image)
 *     tags: [SavedLooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               savedLookId:
 *                 type: string
 *                 description: The ID of the saved look to be deleted
 *                 example: 60d2b3f04f1a2d001fbc2e7d
 *     responses:
 *       200:
 *         description: Saved look deleted successfully
 *       404:
 *         description: Saved look not found
 *       401:
 *         description: Unauthorized
 */
router.route('/saved-looks')
    .get(protect, getSavedLooks)
    .post(protect, upload.single('savedLookImage'), addSavedLook)
    .delete(protect, deleteSavedLook);

module.exports = router;
