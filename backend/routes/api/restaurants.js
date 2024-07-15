const express = require('express');
const { Restaurant, Recipe } = require('../../db/models/restaurant'); 

const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    if (restaurants.length === 0) {
      return res.status(404).json({ status: 404, message: 'Restaurants not found' });
    }
    return res.status(200).json({ status: 200, data: restaurants });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get single restaurant by ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ status: 404, message: 'Restaurant not found' });
    }
    return res.status(200).json({ status: 200, data: restaurant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get restaurant recipes
router.get('/recipes/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const recipes = await Recipe.findAll({ where: { restaurantId: id } });
    if (recipes.length === 0) {
      return res.status(404).json({ status: 404, message: 'Recipes not found' });
    }
    return res.status(200).json({ status: 200, data: recipes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create a new restaurant
router.post('/addRestaurant', async (req, res) => {
  const { name, location, userId, cuisineId, rating, notes, image } = req.body;
  try {
    const newRestaurant = await Restaurant.create({ name, location, userId, cuisineId, rating, notes, image });
    return res.json({ status: 200, data: newRestaurant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

// Update a restaurant
router.put('/updateRestaurant/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, location, userId, cuisineId, rating, notes, image } = req.body;
  try {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ status: 404, message: 'Restaurant not found' });
    }
    const updatedRestaurant = await restaurant.update({ name, location, userId, cuisineId, rating, notes, image });
    return res.json({ status: 200, data: updatedRestaurant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

// Delete a restaurant
router.delete('/deleteRestaurant/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ status: 404, message: 'Restaurant not found' });
    }
    await restaurant.destroy();
    return res.json({ status: 200, message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

module.exports = router;
