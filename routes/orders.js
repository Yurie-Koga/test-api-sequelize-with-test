var express = require("express");
var router = express.Router();
const db = require("../models/");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Create order
router.post("/", function(req, res, next) {
  const len = req.body.shoppingCart.length;
  if (len < 1) {
    return res.send("Your shopping cart is empty.");
  }

  // loop1: check quantity on inventories table
  req.body.shoppingCart.forEach(function(item) {
    const id = parseInt(item.inventoryID);
    const qty = parseInt(item.quantity);
    db.Inventories.findOne({ where: { id: id } })
      .then(inventory => {
        if (inventory.quantity < qty) {
          return res.send("Please reduce order quantity.");
        }
      })
      .catch(err => {
        console.log("There was an error querying orders", JSON.stringify(err));
        return res.send(err);
      });
  });

  // loop2: update both of inventories/orders table
  req.body.shoppingCart.forEach(function(item) {
    // update inventories
    const id = parseInt(item.inventoryID);
  const { quantity } = req.body;
   db.Inventories.findOne({ where: { id: id } })
   .then(inventory => {
     inventory
      .update({ quantity: inventory.quantity - quantity }) // + or -
      .then(inventories => res.send(inventories))
      .catch(err => {
        console.log(
          "There was an error updating an inventory",
          JSON.stringify(err)
        );
        return res.send(err);
      });

});

// Read all orders
router.get("/", function(req, res, next) {
  return db.Orders.findAll()
    .then(orders => res.send(orders))
    .catch(err => {
      console.log("There was an error querying orders", JSON.stringify(err));
      return res.send(err);
    });
});

// Read single order
router.get("/:id", function(req, res, next) {
  const id = parseInt(req.params.id);
  return db.Orders.findOne({ where: { id: id } })
    .then(orders => res.send(orders))
    .catch(err => {
      console.log("There was an error querying orders", JSON.stringify(err));
      return res.send(err);
    });
});

// Update order

// Delete order

module.exports = router;
