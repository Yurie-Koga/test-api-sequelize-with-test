"use strict";
module.exports = (sequelize, DataTypes) => {
  const Inventories = sequelize.define(
    "Inventories",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      quantity: DataTypes.INTEGER
    },
    {}
  );
  Inventories.associate = function(models) {
    // associations can be defined here
  };
  return Inventories;
};
