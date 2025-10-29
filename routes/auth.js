const express = require("express");
const { signup, login, profile } = require("../controllers/authController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", protect, profile);

module.exports = router;   // ✅ CommonJS export