"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cuisine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cuisine.init(
    {
      cuisineid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      country: DataTypes.STRING,
      value: DataTypes.STRING,
      userid: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cuisine",
    }
  );
  return Cuisine;
};
