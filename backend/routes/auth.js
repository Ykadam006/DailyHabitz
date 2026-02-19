const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginValidator, registerValidator, handleValidation } = require("../middleware/validateAuth");
const { authRateLimiter } = require("../middleware/rateLimit");

router.post("/register", authRateLimiter, registerValidator, handleValidation, authController.register);
router.post("/login", authRateLimiter, loginValidator, handleValidation, authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

module.exports = router;
