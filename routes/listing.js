const router = require("express").Router();
const dotenv = require("dotenv");
const User = require("../models/User");
const Place = require("../models/Place");
const jwt = require("jsonwebtoken");

dotenv.config();
router.post("/addmylisting", async (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
      if (error) throw error;
      const placeDoc = await Place.create({
        owner: userData.id, //userdata comes from decrypting the cookie or token
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      res.status(200).json(placeDoc);
    });
  } else {
    return res.status(401).json(null);
  }
});
router.put("/addmylisting", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
      if (error) throw error;
      const place = await Place.findById(id);
      if (userData.id === place.owner.toString()) {
        place.set({
          //owner: userData.id, //userdata comes from decrypting the cookie or token
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price,
        });
        await place.save();
        res.status(200).json(place);
      } else {
        res.status(401).json(null);
      }
    });
  } else {
    return res.status(401).json(null);
  }
});
router.get("/mylistings", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
      if (error) throw error;
      const { id } = userData;
      res.status(200).json(await Place.find({ owner: id }));
    });
  } else {
    return res.status(401).json(null);
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  //console.log(id);
  try{
  const place = await Place.findById(id);
  //  console.log(place);
  res.status(200).json(place);
  } catch(error){
    res.status(501).json(error);
    return;
  }
});

module.exports = router;
