// backend/routes/api/index.js
const router = require("express").Router();
// const sessionRouter = require('./session.js')
const usersRouter = require("./users.js");
const cuisineRouter = require('./cuisines.js')
const restaurantRouter = require('./restaurants.js')
const recipeRouter = require('./recipes.js')
const reviewRouter = require('./reviews.js')
const favoritesRouter = require('./favorites.js')

// const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
// router.use(restoreUser);

// router.use('/session', sessionRouter);
router.use("/users", usersRouter);
router.use('/cuisines', cuisineRouter);
router.use('/restaurants', restaurantRouter);
router.use('/recipes', recipeRouter);
router.use('/reviews', reviewRouter);
router.use('/favorites', favoritesRouter);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
