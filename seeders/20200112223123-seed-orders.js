"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Orders",
      [
        {
          email: "email1@internet.com",
          orderPlaced: "January 09, 2020",
          status: "shipped",
          createdAt: new Date().toDateString(),
          updatedAt: new Date().toDateString()
        },
        {
          email: "email2@internet.com",
          orderPlaced: "January 10, 2020",
          status: "preparing to ship",
          createdAt: new Date().toDateString(),
          updatedAt: new Date().toDateString()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete("Orders", null, {});
  }
};
