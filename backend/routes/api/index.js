// backend/routes/api/index.js
const router = require("express").Router();
const usersRouter = require("./users.js");
const cuisineRouter = require("./cuisines.js");
const restaurantRouter = require("./restaurants.js");
const recipeRouter = require("./recipes.js");
const reviewRouter = require("./reviews.js");
const favoritesRouter = require("./favorites.js");
const searchRouter = require("./search.js");

router.use("/users", usersRouter);
router.use("/cuisines", cuisineRouter);
router.use("/restaurants", restaurantRouter);
router.use("/recipes", recipeRouter);
router.use("/reviews", reviewRouter);
router.use("/favorites", favoritesRouter);
router.use("/search", searchRouter);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
