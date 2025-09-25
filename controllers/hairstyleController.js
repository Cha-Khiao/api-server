const Hairstyle = require('../models/Hairstyle.js');

// @desc    Create a new hairstyle
// @route   POST /api/hairstyles
const createHairstyle = async (req, res) => {
  try {
    const { name, description, imageUrls, tags, suitableFaceShapes, gender } = req.body;
    const hairstyle = new Hairstyle({
      name, description, imageUrls, tags, suitableFaceShapes, gender
    });
    const createdHairstyle = await hairstyle.save();
    res.status(201).json(createdHairstyle);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get all hairstyles
// @route   GET /api/hairstyles
const getHairstyles = async (req, res) => {
  try {
    const hairstyles = await Hairstyle.find({});
    res.json(hairstyles);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get hairstyle by ID
// @route   GET /api/hairstyles/:id
const getHairstyleById = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findById(req.params.id);
    if (hairstyle) {
      res.json(hairstyle);
    } else {
      res.status(404).json({ message: 'ไม่พบทรงผมนี้' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Update a hairstyle
// @route   PUT /api/hairstyles/:id
const updateHairstyle = async (req, res) => {
  try {
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
      res.status(404).json({ message: 'ไม่พบทรงผมนี้' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};


// @desc    Delete a hairstyle
// @route   DELETE /api/hairstyles/:id
const deleteHairstyle = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findById(req.params.id);
    if (hairstyle) {
      await hairstyle.deleteOne(); // ใช้ .deleteOne() สำหรับ Mongoose v6+
      res.json({ message: 'ทรงผมถูกลบแล้ว' });
    } else {
      res.status(404).json({ message: 'ไม่พบทรงผมนี้' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};


module.exports = {
  createHairstyle,
  getHairstyles,
  getHairstyleById,
  updateHairstyle,
  deleteHairstyle
};