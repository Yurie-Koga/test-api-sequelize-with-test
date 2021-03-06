"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Inventories",
      [
        {
          name: "Item 1",
          description: "This is item 1",
          price: 11.99,
          quantity: 10,
          createdAt: new Date().toDateString(),
          updatedAt: new Date().toDateString()
        },
        {
          name: "Item 2",
          description: "This is item 2",
          price: 3.0,
          quantity: 5,
          createdAt: new Date().toDateString(),
          updatedAt: new Date().toDateString()
        },
        {
          name: "Item 3",
          description: "This is item 3",
          price: 6.5,
          quantity: 0,
          createdAt: new Date().toDateString(),
          updatedAt: new Date().toDateString()
        },
        {
          name: "Item 4",
          description: "This is item 3",
          price: 6.5,
          quantity: 10,
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

    return queryInterface.bulkDelete("Inventories", null, {});
  }
};
