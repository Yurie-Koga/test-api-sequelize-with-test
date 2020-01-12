'use strict';
module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define('Orders', {
    email: DataTypes.STRING,
    orderPlaced: DataTypes.DATE,
    status: DataTypes.STRING
  }, {});
  Orders.associate = function(models) {
    // associations can be defined here
  };
  return Orders;
};