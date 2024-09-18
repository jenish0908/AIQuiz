const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { filterByScore, filter } = require("../controllers/filterContoller");
const { get } = require("http");
dotenv.config();

router.post("/filter", async (req, res) => {
  filter(req, res);
});
router.post("/filter-Score", async (req, res) => {
  filterByScore(req, res);
});

module.exports = router;
