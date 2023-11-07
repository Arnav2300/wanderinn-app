const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  address: { type: String, required: true },
  photos: { type: [String], required: true },
  description: { type: String, required: false },
  perks: { type: [String], required: true },
  extraInfo: { type: String, required: false },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  maxGuests: { type: Number, required: true },
  price: { type: Number, required: true },
});
const PlaceModel = mongoose.model("Place", PlaceSchema);
module.exports = PlaceModel;
