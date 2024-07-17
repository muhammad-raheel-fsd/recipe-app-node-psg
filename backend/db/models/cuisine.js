"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cuisine extends Model {
    static associate(models) {
      Cuisine.belongsTo(models.User, { foreignKey: "userId" });
      Cuisine.hasMany(models.Restaurant, { foreignKey: "cuisineId" });
      // Cuisine.hasMany(models.Recipe, { foreignKey: "cuisineId" });
    }
  }
  Cuisine.init(
    {
      cuisineId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      country: DataTypes.STRING,
      value: DataTypes.STRING(20),
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cuisine",
    }
  );
  return Cuisine;
};
