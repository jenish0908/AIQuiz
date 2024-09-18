const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schema/userModel");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

exports.signup = async (req, res) => {
  const { username, password } = req.body;

  //   console.log(process.env.JWT_SECRET);

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ "Error:": "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username: username,
      password: hashPassword,
    });
    await user
      .save()
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        return res.status(400).json({
          error: e.message,
        });
      });
    const payload = {
      user: {
        id: user.id,
      },
    };
    console.log(payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      res.status(400).json({ error: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: " Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
