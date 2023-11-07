const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Bookmark = require("../models/Bookmark");
const dotenv = require("dotenv");

dotenv.config();
router.post("/:id", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
      if (error) throw error;
      try {
        
      } catch (error) {
        res.status(501).json(error);
      }
    });
  } else {
    res.status(401).json("need to login/register");
  }
});
