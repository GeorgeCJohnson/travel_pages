const express = require("express");
const router = express.Router();
const { Avatar } = require("../../models"); // Corrected 'Avatars' to 'Avatar' for consistency

// Create a new avatar
router.post("/", async (req, res) => {
  try {
    const avatar = await Avatar.create(req.body);
    res.status(201).json(avatar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an avatar by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Avatar.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).json({ message: 'Avatar deleted' });
    } else {
      res.status(404).json({ error: 'Avatar not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all avatars
router.get("/", async (req, res) => {
  try {
    const avatars = await Avatar.findAll();
    res.status(200).json(avatars);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific avatar by ID
router.get("/:id", async (req, res) => {
  try {
    const avatar = await Avatar.findByPk(req.params.id);
    if (avatar) {
      res.status(200).json(avatar);
    } else {
      res.status(404).json({ error: "Avatar not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an avatar by ID
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Avatar.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedAvatar = await Avatar.findByPk(req.params.id);
      res.status(200).json(updatedAvatar);
    } else {
      res.status(404).json({ error: "Avatar not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
