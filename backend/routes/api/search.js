const express = require("express");
const { Op } = require("sequelize");
const { Recipe, Restaurant, Cuisine } = require("../../db/models"); // Adjust the path as necessary
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { searchquery, tags, cuisine } = req.body;

    // Base query object
    let query = {
      include: [
        {
          model: Restaurant,
          required: true,
          include: [
            {
              model: Cuisine,
              required: true,
            },
          ],
        },
      ],
      where: {},
    };

    // Adding search conditions
    if (searchquery !== "") {
      query.where = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchquery}%` } },
          { "$Restaurant.name$": { [Op.iLike]: `%${searchquery}%` } },
          { ingredients: { [Op.contains]: [searchquery] } }, // Adjust this condition if necessary
        ],
      };
    }

    // Adding tags condition
    if (tags !== "") {
      query.where.tags = { [Op.contains]: [tags] }; // Adjust this condition if necessary
    }

    // Adding cuisine condition
    if (cuisine !== undefined) {
      query.include[0].include[0].where = { cuisineId: cuisine };
    }

    console.log("query", JSON.stringify(query, null, 2));

    const recipesBySearchQuery = await Recipe.findAll(query);

    if (recipesBySearchQuery.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Data not found",
      });
    }

    res.status(200).json({
      status: 200,
      data: recipesBySearchQuery,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

module.exports = router;

// const express = require("express");
// const { Op } = require("sequelize");
// const { Recipe, Restaurant, Cuisine } = require("../../db/models"); // Adjust the path as necessary
// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const { searchquery, tags, cuisine } = req.body;

//     // Base query object
//     let query = {
//       include: [
//         {
//           model: Restaurant,
//           required: true,
//           include: [
//             {
//               model: Cuisine,
//               required: true,
//             },
//           ],
//         },
//       ],
//       where: {},
//     };

//     // Adding search conditions
//     if (searchquery !== "") {
//       query.where = {
//         [Op.or]: [
//           { name: { [Op.iLike]: `%${searchquery}%` } },
//           { "$Restaurant.name$": { [Op.iLike]: `%${searchquery}%` } },
//           { ingredients: { [Op.contains]: [searchquery] } }, // Adjust this condition if necessary
//         ],
//       };
//     }

//     // Adding tags condition
//     if (tags !== "") {
//       query.where.tags = { [Op.contains]: [tags] }; // Adjust this condition if necessary
//     }

//     // Adding cuisine condition
//     if (cuisine !== undefined) {
//       query.include[0].where = { cuisineId: cuisine };
//     }

//     console.log("query", JSON.stringify(query, null, 2));

//     const recipesBySearchQuery = await Recipe.findAll(query);

//     if (recipesBySearchQuery.length === 0) {
//       return res.status(404).json({
//         status: 404,
//         message: "Data not found",
//       });
//     }

//     res.status(200).json({
//       status: 200,
//       data: recipesBySearchQuery,
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({
//       status: 500,
//       message: err.message,
//     });
//   }
// });

// module.exports = router;
