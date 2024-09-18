const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { generateHint } = require("../controllers/hintController");
const dotenv = require("dotenv");
dotenv.config();

router.post("/generate-hint", async (req, res) => {
  generateHint(req, res);
});

module.exports = router;
