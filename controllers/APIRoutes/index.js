const router = require("express").Router();
const userRoutes = require("./userRoutes");
const avatarRoutes = require("./avatarRoutes");
const pinRoutes= require("./pinRoutes");

router.use("/user", userRoutes);
router.use("/avatars", avatarRoutes);
router.use("/pins", pinRoutes);

//Catch undefined API routes
router.use((req, res) => {
    res.status(404).json({error: "API route not found"});
});

module.exports = router;