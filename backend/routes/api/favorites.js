const express = require('express');
const { Favorite, Recipe } = require('../../db/models');

const router = express.Router();

// Get user's favorites by user ID
router.get('/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [{ model: Recipe, attributes: ['recipeId', 'name', 'restaurantId', 'notes', 'userId', 'image', 'ingredients', 'steps', 'tags'] }]
    });

    if (favorites.length === 0) {
      return res.status(404).json({ status: 404, message: 'Favorites not found' });
    }

    return res.status(200).json({ status: 200, data: favorites });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create a new favorite
router.post('/addFavorite', async (req, res) => {
  const { userId, recipeId } = req.body;
  try {
    const newFavorite = await Favorite.create({ userId, recipeId });
    return res.status(200).json({ status: 200, data: newFavorite });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

// Delete a favorite by favorite ID
router.delete('/deleteFavorite/:id', async (req, res) => {
  const favoriteId = parseInt(req.params.id, 10);
  try {
    const favorite = await Favorite.findByPk(favoriteId);
    if (!favorite) {
      return res.status(404).json({ status: 404, message: 'Favorite not found' });
    }
    await favorite.destroy();
    return res.status(200).json({ status: 200, message: 'Favorite deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

module.exports = router;
