"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        username: "demouser",
        email: "demouser@gmail.com",
        password:
          "$2a$10$XZo7/W1/BoZu02TDhrPAaOarW.3vW.CUroG2T5urzUxjAAUglg9SW",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
