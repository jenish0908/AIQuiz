const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { sendResultsOverEmail } = require("../controllers/mailerContoller");
const dotenv = require("dotenv");
dotenv.config();

router.post("/send-result", async (req, res) => {
  sendResultsOverEmail(req, res);
});

module.exports = router;
