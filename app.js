const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

// Models (optional if not used directly in app.js)
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
app.engine("ejs", engine); // for layout support
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// DB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// Session & Flash setup (IMPORTANT: must be before routes)
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
};
app.use(session(sessionOptions));
app.use(flash());

// Middleware to expose flash messages to all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error"); 
  next();
});

// Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root.");
});

// Start Server
app.listen(8080, () => {
  console.log("🚀 Server is running on port 8080");
});
