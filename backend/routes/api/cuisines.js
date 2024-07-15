const express = require('express');
const { Cuisine } = require('../../db/models/cuisine'); 

const router = express.Router();

// Get all cuisines
router.get('/', async (req, res) => {
  try {
    const cuisines = await Cuisine.findAll();
    if (cuisines.length === 0) {
      return res.status(404).json({ status: 404, message: 'Cuisines not found' });
    }
    return res.status(200).json({ status: 200, data: cuisines });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get single cuisine by ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const cuisine = await Cuisine.findByPk(id);
    if (!cuisine) {
      return res.status(404).json({ status: 404, message: 'Cuisine not found' });
    }
    return res.status(200).json({ status: 200, data: cuisine });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create a new cuisine
router.post('/addCuisine', async (req, res) => {
  const { name, description, country, value, userId } = req.body;
  try {
    const newCuisine = await Cuisine.create({ name, description, country, value, userId });
    return res.json({ status: 200, data: newCuisine });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

// Update a cuisine
router.put('/updateCuisine/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description, country, value, userId } = req.body;
  try {
    const cuisine = await Cuisine.findByPk(id);
    if (!cuisine) {
      return res.status(404).json({ status: 404, message: 'Cuisine not found' });
    }
    const updatedCuisine = await cuisine.update({ name, description, country, value, userId });
    return res.json({ status: 200, data: updatedCuisine });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

// Delete a cuisine
router.delete('/deleteCuisine/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const cuisine = await Cuisine.findByPk(id);
    if (!cuisine) {
      return res.status(404).json({ status: 404, message: 'Cuisine not found' });
    }
    await cuisine.destroy();
    return res.json({ status: 200, message: 'Cuisine deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

module.exports = router;
