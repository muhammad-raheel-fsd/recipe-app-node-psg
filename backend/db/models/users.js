"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User.hasMany(models.Cuisine, { foreignKey: "userId" });
      // User.hasMany(models.Restaurant, { foreignKey: "userId" });
      // User.hasMany(models.Recipe, { foreignKey: "userId" });
      // User.hasMany(models.Favorite, { foreignKey: "userId" });
      // User.hasMany(models.Review, { foreignKey: "userId" });

      User.hasMany(models.Cuisine, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Restaurant, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Recipe, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Favorite, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Review, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
