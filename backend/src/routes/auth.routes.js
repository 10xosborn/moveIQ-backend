const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const protect = require("../middleware/auth.middleware");

// register new user
router.post("/register", authController.register);

// login user
router.post("/login", authController.login);

// get current logged-in user (protected route)
router.get("/me", protect, authController.getMe);

module.exports = router;