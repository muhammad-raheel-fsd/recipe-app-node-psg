"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      Restaurant.belongsTo(models.Cuisine, { foreignKey: "cuisineId" });
      Restaurant.belongsTo(models.User, { foreignKey: "userId" });
      Restaurant.hasMany(models.Recipe, { foreignKey: "restaurantId" });
    }
  }
  Restaurant.init(
    {
      restaurantId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cuisineId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: DataTypes.STRING,
      rating: DataTypes.DOUBLE,
      notes: DataTypes.TEXT,
      image: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Restaurant",
    }
  );
  return Restaurant;
};
