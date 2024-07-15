// "use strict";
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable("Recipes", {
//       recipeid: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER,
//       },
//       name: {
//         type: Sequelize.STRING,
//       },
//       restaurantid: {
//         type: Sequelize.INTEGER,
//       },
//       notes: {
//         type: Sequelize.TEXT,
//       },
//       userid: {
//         type: Sequelize.INTEGER,
//       },
//       image: {
//         type: Sequelize.TEXT,
//       },
//       ingredients: {
//         type: Sequelize.ARRAY,
//       },
//       steps: {
//         type: Sequelize.ARRAY,
//       },
//       tags: {
//         type: Sequelize.ARRAY,
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//       },
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable("Recipes");
//   },
// };

"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Recipes", {
      recipeid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      restaurantid: {
        type: Sequelize.INTEGER,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      userid: {
        type: Sequelize.INTEGER,
      },
      image: {
        type: Sequelize.TEXT,
      },
      ingredients: {
        type: Sequelize.ARRAY(Sequelize.STRING), // specify type of array values
      },
      steps: {
        type: Sequelize.ARRAY(Sequelize.STRING), // specify type of array values
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING), // specify type of array values
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Recipes");
  },
};
