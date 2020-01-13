var express = require("express");
var router = express.Router();
const db = require("../models/");

// Create order
// ===== req.body.shoppingCart must be like this =====
// {
//   "email": "yurie@yurie",
// 	  "shoppingCart": [
//     {
//       "inventoryId":1,
//       "quantity":1
//     },
//     {
//       "inventoryId":2,
//       "quantity":1
//     }
//   ]
// }
router.post("/", function(req, res, next) {
  const len = req.body.shoppingCart.length;
  if (len < 1) {
    return res.send("Your shopping cart is empty.");
  }

  // Loop1: check quantity on inventories table
  req.body.shoppingCart.forEach(function(item) {
    const id = parseInt(item.inventoryId);
    const orderQty = parseInt(item.quantity);
    db.Inventories.findOne({ where: { id: id } })
      .then(inventories => {
        if (inventories.quantity < orderQty) {
          return res.send("Please reduce order quantity.");
        }
      })
      .catch(err => {
        console.log("There was an error querying orders", JSON.stringify(err));
        return res.send(err);
      });
  });

  // Loop2: update both of inventories/orders table
  req.body.shoppingCart.forEach(function(item) {
    // Update inventories
    const id = parseInt(item.inventoryId);
    const orderQty = parseInt(item.quantity);
    db.Inventories.findOne({ where: { id: id } })
      .then(inventories => {
        inventories.update({ quantity: inventories.quantity - orderQty });
      })
      .catch(err => {
        console.log(
          "There was an error updating an inventory",
          JSON.stringify(err)
        );
        return res.send(err);
      });

    // Update orders
    db.Orders.create({
      inventoryId: id,
      quantity: orderQty,
      email: req.body.email,
      orderPlaced: new Date().toDateString(),
      status: "Ordered"
    }).catch(err => {
      console.log("There was an error updating an order", JSON.stringify(err));
      return res.send(err);
    });
  });

  return res.send("Completed order.");
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
router.put("/:id", function(req, res, next) {
  // Get inventoryId from orders
  const orderId = parseInt(req.params.id);
  db.Orders.findOne({ where: { id: orderId } })
    .then(orders => {
      return db.Inventories.findOne({ where: { id: orders.inventoryId } }).then(
        inventories => {
          return Promise.resolve({
            orders: orders,
            inventories: inventories
          });
        }
      );
    })
    .then(result => {
      // Update inventories
      const oldOrderQty = parseInt(result.orders.quantity);
      const newOrderQty = parseInt(req.body.quantity);
      const diffQty = oldOrderQty - newOrderQty;
      const newInventoryQty = parseInt(result.inventories.quantity) + diffQty;
      // Check quantity on inventories
      if (newInventoryQty < 0) {
        return res.send("Please reduce order quantity.");
      }
      db.Inventories.findOne({ where: { id: result.inventories.id } })
        .then(inventories => {
          inventories.update({ quantity: newInventoryQty });
        })
        .catch(err => {
          console.log(
            "There was an error updating an inventory",
            JSON.stringify(err)
          );
          return res.send(err);
        });
    });

  // Update orders
  const { inventoryId, quantity, email, orderPlaced, status } = req.body;
  db.Orders.findOne({ where: { id: orderId } }).then(orders => {
    return orders
      .update({ inventoryId, quantity, email, orderPlaced, status })
      .then(orders => res.send(orders))
      .catch(err => {
        console.log(
          "There was an error updating an order",
          JSON.stringify(err)
        );
        return res.send(err);
      });
  });
});

// Delete order
router.delete("/:id", function(req, res, next) {
  // Get inventoryId from orders
  const orderId = parseInt(req.params.id);
  db.Orders.findOne({ where: { id: orderId } })
    .then(orders => {
      return db.Inventories.findOne({ where: { id: orders.inventoryId } }).then(
        inventories => {
          return Promise.resolve({
            orders: orders,
            inventories: inventories
          });
        }
      );
    })
    .then(result => {
      // Update inventories
      const newQty =
        parseInt(result.inventories.quantity) +
        parseInt(result.orders.quantity);
      db.Inventories.findOne({ where: { id: result.inventories.id } })
        .then(inventories => {
          inventories.update({
            quantity: newQty
          });
        })
        .catch(err => {
          console.log(
            "There was an error updating an inventory",
            JSON.stringify(err)
          );
          return res.send(err);
        });
    });

  // Delete from orders
  db.Orders.findOne({ where: { id: orderId } }).then(orders => {
    return orders
      .destroy({ force: true })
      .then(() => res.send({ orderId }))
      .catch(err => {
        console.log(
          "There was an error deleting an order",
          JSON.stringify(err)
        );
        return res.send(err);
      });
  });
});

module.exports = router;
