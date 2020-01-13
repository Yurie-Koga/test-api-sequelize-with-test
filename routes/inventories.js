var express = require("express");
var router = express.Router();
const db = require("../models/");

// Create inventory item
router.post("/", function(req, res, next) {
  const { name, description, price, quantity } = req.body;
  return db.Inventories.create({ name, description, price, quantity })
    .then(inventories => res.send(inventories))
    .catch(err => {
      console.log(
        "There was an error creating an inventory",
        JSON.stringify(err)
      );
      return res.send(err);
    });
});

// Read all inventory item
router.get("/", function(req, res, next) {
  return db.Inventories.findAll()
    .then(inventories => res.send(inventories))
    .catch(err => {
      console.log(
        "There was an error querying inventories",
        JSON.stringify(err)
      );
      return res.send(err);
    });
});

// Read single inventory item
router.get("/:id", function(req, res, next) {
  const id = parseInt(req.params.id);
  return db.Inventories.findOne({ where: { id: id } })
    .then(inventories => res.send(inventories))
    .catch(err => {
      console.log(
        "There was an error querying an inventory",
        JSON.stringify(err)
      );
      return res.send(err);
    });
});

// Update inventory item
router.put("/:id", function(req, res, next) {
  const id = parseInt(req.params.id);
  const { name, description, price, quantity } = req.body;
  // return: updated record's object
  return db.Inventories.findOne({ where: { id: id } }).then(inventory => {
    return inventory
      .update({ name, description, price, quantity })
      .then(inventories => res.send(inventories))
      .catch(err => {
        console.log(
          "There was an error updating an inventory",
          JSON.stringify(err)
        );
        return res.send(err);
      });
  });

  // This one also works, return: number (might be updated records number)
  //   return db.Inventories.update(
  //     { name, description, price, quantity },
  //     {
  //       where: {
  //         id: id
  //       }
  //     }
  //   )
  //     .then(inventories => res.send(inventories))
  //     .catch(err => {
  //       console.log(
  //         "There was an error updating an inventory",
  //         JSON.stringify(err)
  //       );
  //       return res.send(err);
  //     });
});

// Delete inventory item
router.delete("/:id", function(req, res, next) {
  const id = parseInt(req.params.id);
  return db.Inventories.findOne({ where: { id: id } }).then(inventory => {
    return inventory
      .destroy({ force: true })
      .then(() => res.send({ id }))
      .catch(err => {
        console.log(
          "There was an error deleting an inventory",
          JSON.stringify(err)
        );
        return res.send(err);
      });
  });
});

module.exports = router;
