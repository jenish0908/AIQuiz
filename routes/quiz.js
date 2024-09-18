const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Quiz = require("../schema/quizModel");
const User = require("../schema/userModel");
const { generateQuiz } = require("../controllers/quizController");
const dotenv = require("dotenv");
dotenv.config();

router.post("/generate", async (req, res) => {
  generateQuiz(req, res);
});

module.exports = router;
