"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Recipes", {
      recipeId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      restaurantId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Restaurants",
          key: "restaurantId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      notes: {
        type: Sequelize.TEXT,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "userId",
        },
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      },
      image: {
        type: Sequelize.TEXT,
      },
      ingredients: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
      },
      steps: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Recipes");
  },
};
