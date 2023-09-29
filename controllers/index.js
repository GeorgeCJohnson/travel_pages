const router = require("express").Router();
const htmlRoutes = require("./htmlRoutes");
const apiRoutes = require("./APIRoutes");

router.use("/", htmlRoutes);
router.use("/api", apiRoutes);

module.exports = router;
