"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Recipe.init(
    {
      recipeid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      name: DataTypes.STRING,
      restaurantid: DataTypes.INTEGER,
      notes: DataTypes.TEXT,
      userid: DataTypes.INTEGER,
      image: DataTypes.TEXT,
      // ingredients: DataTypes.ARRAY,
      // steps: DataTypes.ARRAY,
      // tags: DataTypes.ARRAY,
      ingredients: {
        type: DataTypes.ARRAY(DataTypes.STRING), // specify type of array values
        allowNull: false,
      },
      steps: {
        type: DataTypes.ARRAY(DataTypes.STRING), // specify type of array values
        allowNull: false,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING), // specify type of array values
      },
    },
    {
      sequelize,
      modelName: "Recipe",
    }
  );
  return Recipe;
};
