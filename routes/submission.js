const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const {
  submitQuiz,
  getSubmissions,
} = require("../controllers/submissionController");
const { get } = require("http");
dotenv.config();

router.post("/submit", async (req, res) => {
  submitQuiz(req, res);
});

router.get("/getSubmissions", async (req, res) => {
  getSubmissions(req, res);
});

module.exports = router;
