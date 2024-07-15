"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Restaurant.init(
    {
      restaurantid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      name: DataTypes.STRING,
      location: DataTypes.STRING,
      cuisineid: DataTypes.INTEGER,
      userid: DataTypes.INTEGER,
      rating: DataTypes.FLOAT,
      notes: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Restaurant",
    }
  );
  return Restaurant;
};
