const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");

// Models (only if needed directly in app.js)
const Listing = require("./models/listing");
const Review = require("./models/review");

// Routers
const listings = require("./routes/listing");
const reviews = require("./routes/review");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// DB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error(err));

// Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Root Route
app.get("/", (req, res) => {
  res.send("hi I am root");
});

// Start Server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
