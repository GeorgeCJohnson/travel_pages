const router = require("express").Router();
const userRoutes = require("./userRoutes");
const avatarRoutes = require("./avatarRoutes");
const pinRoutes= require("./pinRoutes");

router.use("/controllers/APIRoutes/userRoutes.js", userRoutes);
router.use("/controllers/APIRoutes/avatarRoutes.js", avatarRoutes);
router.use("/controllers/APIRoutes/pinRoutes.js", pinRoutes);

//Catch undefined API routes
router.use((req, res) => {
    res.status(404).json({error: "API route not found"});
});

module.exports = router;