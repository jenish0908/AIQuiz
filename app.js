const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const conn = require("./service/db");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();
app.get("/", (req, res) => {
  res.send("Hello from server side!");
});
app.use("/api", require("./routes/user"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/submission", require("./routes/submission"));
app.use("/api/filters", require("./routes/filter"));
//Bonus endpoints
app.use("/api/hint", require("./routes/hint"));
// app.use("/api/sendResult", require("./routes/sendmail"));
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
