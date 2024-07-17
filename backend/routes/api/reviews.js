const express = require('express');
const { Review } = require('../../db/models'); // Adjust the path as necessary

const router = express.Router();

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.findAll();
    if (reviews.length === 0) {
      return res.status(404).json({ status: 404, message: 'Reviews not found' });
    }
    return res.status(200).json({ status: 200, data: reviews });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get single review by ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ status: 404, message: 'Review not found' });
    }
    return res.status(200).json({ status: 200, data: review });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create a new review
router.post('/addReview', async (req, res) => {
  const { content, rating, userId, recipeId, date } = req.body;
  try {
    const newReview = await Review.create({ content, rating, userId, recipeId, date });
    return res.json({ status: 200, data: newReview });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

// Update a review
router.put('/updateReview/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { content, rating, userId, recipeId, date } = req.body;
  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ status: 404, message: 'Review not found' });
    }
    const updatedReview = await review.update({ content, rating, userId, recipeId, date });
    return res.json({ status: 200, data: updatedReview });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

// Delete a review
router.delete('/deleteReview/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ status: 404, message: 'Review not found' });
    }
    await review.destroy();
    return res.json({ status: 200, message: 'Review deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

module.exports = router;
