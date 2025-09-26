const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {
  createHairstyle,
  getHairstyles,
  getHairstyleById,
  updateHairstyle,
  deleteHairstyle
} = require('../controllers/hairstyleController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

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
 *     Hairstyle:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - imageUrls
 *         - gender
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the hairstyle
 *         name:
 *           type: string
 *           description: The name of the hairstyle
 *           example: ทรงผมคอมม่า
 *         description:
 *           type: string
 *           description: A short description of the hairstyle
 *           example: ทรงผมยอดนิยมสไตล์เกาหลี
 *         imageUrls:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://example.com/image.jpg"]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["สไตล์เกาหลี", "ผมสั้น"]
 *         suitableFaceShapes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["รูปไข่"]
 *         gender:
 *           type: string
 *           enum: [ชาย, หญิง, Unisex]
 *           example: ชาย
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the hairstyle was created
 */

/**
 * @swagger
 * tags:
 *   - name: Hairstyles
 *     description: Hairstyle management
 */

/**
 * @swagger
 * /api/hairstyles:
 *   get:
 *     summary: Get a list of all hairstyles
 *     tags: [Hairstyles]
 *     responses:
 *       200:
 *         description: A list of hairstyles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hairstyle'
 *   post:
 *     summary: Create a new hairstyle (Admin only)
 *     tags: [Hairstyles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hairstyle'
 *     responses:
 *       201:
 *         description: Hairstyle created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin)
 */
router.route('/')
  .get(getHairstyles)
  .post(
    protect,
    admin,
    [ // Validation rules for creating a hairstyle
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('imageUrls', 'Image URLs must be an array with at least one URL').isArray({ min: 1 }),
      check('gender', 'Gender is required and must be ชาย, หญิง, or Unisex').isIn(['ชาย', 'หญิง', 'Unisex']),
    ],
    validateRequest,
    createHairstyle
  );

/**
 * @swagger
 * /api/hairstyles/{id}:
 *   get:
 *     summary: Get a single hairstyle by ID
 *     tags: [Hairstyles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The hairstyle ID
 *     responses:
 *       200:
 *         description: Detailed information about a hairstyle
 *       404:
 *         description: Hairstyle not found
 *   put:
 *     summary: Update a hairstyle (Admin only)
 *     tags: [Hairstyles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The hairstyle ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hairstyle'
 *     responses:
 *       200:
 *         description: Hairstyle updated successfully
 *       404:
 *         description: Hairstyle not found
 *   delete:
 *     summary: Delete a hairstyle (Admin only)
 *     tags: [Hairstyles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The hairstyle ID
 *     responses:
 *       200:
 *         description: Hairstyle deleted successfully
 *       404:
 *         description: Hairstyle not found
 */
router.route('/:id')
  .get(getHairstyleById)
  .put(
    protect,
    admin,
    [ // Optional validation rules for updating
      check('name').optional().not().isEmpty(),
      check('description').optional().not().isEmpty(),
      check('imageUrls').optional().isArray({ min: 1 }),
      check('gender').optional().isIn(['ชาย', 'หญิง', 'Unisex']),
    ],
    validateRequest,
    updateHairstyle
  )
  .delete(protect, admin, deleteHairstyle);

module.exports = router;
