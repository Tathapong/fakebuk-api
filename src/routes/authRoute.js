const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

// ต้องผ่านการ Authenticate
router.route("/me").get(authenticate, authController.getMe);

module.exports = router;
