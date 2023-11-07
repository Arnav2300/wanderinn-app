const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./routes/auth.js");
const listingRoute = require("./routes/listing.js");
const bookingRoute = require("./routes/booking.js");
const cookieParser = require("cookie-parser");
const download = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const Place = require("./models/Place.js");
const path=require("path");
const app = express();
dotenv.config();

const PORT=process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")))
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: `${process.env.CLIENT_URL}`,
  })
);

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("connected to mongo"))
  .catch((error) => console.log(error));

//routes
app.use("/auth", authRoute);
app.use("/listing", listingRoute);
app.use("/reserve", bookingRoute);
app.get("/all", async (req, res) => {
  try {
    res.status(200).json(await Place.find());
  } catch (error) {
    res.status(500).json(error);
  }
});
//upload imagae using url
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  try {
    await download.image({
      url: link,
      dest: __dirname + "/uploads/" + newName,
    });
    res.json(newName);
  } catch (error) {
    res.json(error);
  }
});
//upload images using upload feature
const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 20), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const newPath = path + "." + parts[parts.length - 1];
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads", ""));
    //console.log(newPath);
  }
  res.json(uploadedFiles);
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
