const mongoose = require("mongoose");
const router = require("express").Router();
const { signup, login } = require("../controllers/authController");

router.post("/register", async (req, res) => {
  signup(req, res);
});
router.post("/login", async (req, res) => {
  login(req, res);
});

module.exports = router;
