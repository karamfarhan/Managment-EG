const express = require("express");
const {
  signup,
  login,
  protectedRoutes,
} = require("../controllers/authController");
const { getUsers } = require("../controllers/usersController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.route("/").get(protectedRoutes, getUsers);
module.exports = router;
