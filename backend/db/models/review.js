"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Review.init(
    {
      reviewid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      content: DataTypes.TEXT,
      rating: DataTypes.INTEGER,
      userid: DataTypes.INTEGER,
      recipeid: DataTypes.INTEGER,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
