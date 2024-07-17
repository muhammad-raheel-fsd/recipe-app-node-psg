const express = require('express');
const { Recipe, Review } = require('../../db/models'); // Adjust the path as necessary

const router = express.Router();

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    if (recipes.length === 0) {
      return res.status(404).json({ status: 404, message: 'Recipes not found' });
    }
    return res.status(200).json({ status: 200, data: recipes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get single recipe by ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ status: 404, message: 'Recipe not found' });
    }
    return res.status(200).json({ status: 200, data: recipe });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create a new recipe
router.post('/addRecipe', async (req, res) => {
  const { name, restaurantId, notes, userId, image, ingredients, steps, tags } = req.body;
  try {
    const newRecipe = await Recipe.create({ name, restaurantId, notes, userId, image, ingredients, steps, tags });
    return res.json({ status: 200, data: newRecipe });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

// Update a recipe
router.put('/updateRecipe/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, restaurantId, notes, userId, image, ingredients, steps, tags } = req.body;
  try {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ status: 404, message: 'Recipe not found' });
    }
    const updatedRecipe = await recipe.update({ name, restaurantId, notes, userId, image, ingredients, steps, tags });
    return res.json({ status: 200, data: updatedRecipe });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

// Delete a recipe
router.delete('/deleteRecipe/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ status: 404, message: 'Recipe not found' });
    }
    await recipe.destroy();
    return res.json({ status: 200, message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

// Get reviews for a specific recipe
router.get('/reviews/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const reviews = await Review.findAll({ where: { recipeId: id } });
    if (reviews.length === 0) {
      return res.status(404).json({ status: 404, message: 'Reviews not found' });
    }
    return res.status(200).json({ status: 200, data: reviews });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
