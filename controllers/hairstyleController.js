const Hairstyle = require('../models/Hairstyle.js');
const asyncHandler = require('express-async-handler');

// @desc    Create a new hairstyle
// @route   POST /api/hairstyles
const createHairstyle = asyncHandler(async (req, res) => {
  const { name, description, imageUrls, tags, suitableFaceShapes, gender } = req.body;
  
  const hairstyle = new Hairstyle({
    name, description, imageUrls, tags, suitableFaceShapes, gender
  });

  const createdHairstyle = await hairstyle.save();
  res.status(201).json(createdHairstyle);
});

// @desc    Get all hairstyles OR filter by search/tags/gender etc.
// @route   GET /api/hairstyles
const getHairstyles = asyncHandler(async (req, res) => {
  // รับค่า query parameters จาก URL
  const { tags, suitableFaceShapes, gender, search } = req.query;
  let filter = {};

  // สร้าง object สำหรับ query ใน MongoDB
  if (tags) {
    filter.tags = { $in: tags.split(',') };
  }
  if (suitableFaceShapes) {
    filter.suitableFaceShapes = { $in: suitableFaceShapes.split(',') };
  }
  if (gender) {
    filter.gender = gender;
  }
  if (search) {
    // ใช้ Regular Expression สำหรับการค้นหาแบบ case-insensitive (ไม่สนตัวพิมพ์เล็ก/ใหญ่)
    filter.name = { $regex: search, $options: 'i' };
  }

  // ส่ง filter object เข้าไปใน find()
  const hairstyles = await Hairstyle.find(filter);
  res.json(hairstyles);
});

// @desc    Get hairstyle by ID
// @route   GET /api/hairstyles/:id
const getHairstyleById = asyncHandler(async (req, res) => {
  const hairstyle = await Hairstyle.findById(req.params.id);

  if (hairstyle) {
    res.json(hairstyle);
  } else {
    res.status(404);
    throw new Error('ไม่พบทรงผมนี้');
  }
});

// @desc    Update a hairstyle
// @route   PUT /api/hairstyles/:id
const updateHairstyle = asyncHandler(async (req, res) => {
  const { name, description, imageUrls, tags, suitableFaceShapes, gender } = req.body;
  const hairstyle = await Hairstyle.findById(req.params.id);

  if (hairstyle) {
    hairstyle.name = name || hairstyle.name;
    hairstyle.description = description || hairstyle.description;
    hairstyle.imageUrls = imageUrls || hairstyle.imageUrls;
    hairstyle.tags = tags || hairstyle.tags;
    hairstyle.suitableFaceShapes = suitableFaceShapes || hairstyle.suitableFaceShapes;
    hairstyle.gender = gender || hairstyle.gender;

    const updatedHairstyle = await hairstyle.save();
    res.json(updatedHairstyle);
  } else {
    res.status(404);
    throw new Error('ไม่พบทรงผมนี้');
  }
});

// @desc    Delete a hairstyle
// @route   DELETE /api/hairstyles/:id
const deleteHairstyle = asyncHandler(async (req, res) => {
  const hairstyle = await Hairstyle.findById(req.params.id);

  if (hairstyle) {
    await hairstyle.deleteOne();
    res.json({ message: 'ทรงผมถูกลบแล้ว' });
  } else {
    res.status(404);
    throw new Error('ไม่พบทรงผมนี้');
  }
});

module.exports = {
  createHairstyle,
  getHairstyles,
  getHairstyleById,
  updateHairstyle,
  deleteHairstyle
};