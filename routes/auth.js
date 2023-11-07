//import { Router } from "express";
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

//creating new user
dotenv.config();
const salt = bcrypt.genSaltSync(10);
router.post("/signup", async (req, res) => {
  try {
    const { name, email, pass } = req.body;
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(pass, salt),
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(501).json(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const passOk = bcrypt.compareSync(pass, user.password);
    if (passOk) {
      jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) throw error;
          res
            .cookie("token", token, {
              httpOnly: true,
              maxAge: 3600000 * 5,
              secure: true,
              sameSite: "none",
            })
            .json(user);
        }
      );
    } else {
      res.status(401).json("pass not ok");
    }
  } else {
    res.status(401).json("user not found");
  }
});

router.get("/profile", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
      if (error) throw error;
      const { name, email, _id } = await User.findById(userData.id);
      res.status(200).json({ name, email, _id });
    });
  } else {
    return res.json(null);
  }
  //res.json({token})
});

router.post("/logout", async (req, res) => {
  res.cookie("token", "").json(true);
});
module.exports = router;
