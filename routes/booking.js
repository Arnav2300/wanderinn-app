const router = require("express").Router();
const dotenv = require("dotenv");
const User = require("../models/User");
const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");

dotenv.config();
router.post("/", async (req, res) => {
  const { token } = req.cookies;
  const { place, checkIn, checkOut, guests, name, phone, price } = req.body;
  console.log(req.body);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
      if (error) throw error;
      //console.log(userData)
      try {
        const bookingDoc = await Booking.create({
          user: userData.id,
          place,
          checkIn,
          checkOut,
          guests,
          name,
          phone,
          price,
        });
        res.json(bookingDoc);
      } catch (error) {
        //console.log(token);
        //console.log(error);
        res.status(501).json(error);
      }
    });
  } else {
    res.status(401).json("Login/register before reservation");
  }
});

router.get("/", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
      if (error) throw error;
      try {
        res.status(200).json(await Booking.find({ user: userData.id }).populate('place'));
      } catch (error) {
        res.status(501).json(error);
      }
    });
  } else {
    res.status(401).json("Login/register before viewing booking history");
  }
});
module.exports = router;
