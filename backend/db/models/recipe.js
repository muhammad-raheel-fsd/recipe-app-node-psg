"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      Recipe.belongsTo(models.User, { foreignKey: "userId" });
      Recipe.belongsTo(models.Restaurant, { foreignKey: "restaurantId" });
      // Recipe.belongsTo(models.Cuisine, { foreignKey: "cuisineId" });
      Recipe.hasMany(models.Favorite, { foreignKey: "recipeId" });
      Recipe.hasMany(models.Review, { foreignKey: "recipeId" });
    }
  }
  Recipe.init(
    {
      recipeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      restaurantId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      image: DataTypes.TEXT,
      ingredients: DataTypes.ARRAY(DataTypes.TEXT),
      steps: DataTypes.ARRAY(DataTypes.TEXT),
      tags: DataTypes.ARRAY(DataTypes.TEXT),
    },
    {
      sequelize,
      modelName: "Recipe",
    }
  );
  return Recipe;
};
