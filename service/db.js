const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((e) => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    throw e;
  });

module.exports = mongoose.connection;
