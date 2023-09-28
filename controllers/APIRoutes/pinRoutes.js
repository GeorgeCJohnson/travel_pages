const express = require("express");
const router = express.Router();
const { Pins } = require("../../models");
const withAuth = require("../../utils/auth");

//GET route to retrieve all pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pins.findAll();
    res.status(200).json(pins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET route to retrieve a specific pin by pin ID
router.get("/:pinid", async (req, res) => {
  try {
    const pins = await Pins.findByPk(req.params.pinid);
    if (pins) {
      res.status(200).json(pins);
    } else {
      res.status(404).json({ error: "Pin not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST route to create a new pin and assign it to the user
router.post("/create/:id", withAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const newPin = await Pin.create({
      ...req.body,
      user_id: id,
    });

    // Check if the pin was created successfully
    if (newPin) {
      res.status(201).json(newPin);
    } else {
      res.status(400).json({ error: "Failed to create pin" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//PUT route to update a pin
router.put("/update/:pinid", withAuth, async (req, res) => {
  try {
    const [updated] = await Pins.update(req.body, {
      where: { id: req.params.pinid },
    });

    if (updated !== 0) {
      const updatedPin = await Pins.findByPk(req.params.pinid);
      res.status(200).json(updatedPin);
    } else {
      const existingPin = await Pins.findByPk(req.params.pinid);
      if (existingPin) {
        res.status(200).json({ message: "No update has been made." });
      } else {
        res.status(404).json({ error: "Pin not found" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE route to delete a Pin
router.delete("/delete/:id", withAuth, async (req, res) => {
  try {
    const pinData = await Pins.destroy({
      where: {
        id: req.params.id,
        user_id: req.params.id, // Use the correct parameter
      },
    });
    if (pinData) {
      res.status(204).json({ message: "Pin deleted" });
    } else {
      res.status(404).json({ error: "Pin not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
