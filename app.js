const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const Review = require("./models/review");
const methodOverride = require("method-override");
const listings = require("./routes/listing.js");
const engine = require("ejs-mate"); // ✅ FIXED: added `const`

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });





app.post("/listings/:id/reviews", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    const newReview = new Review(req.body.review); // should be { comment: '', rating: '' }
    await newReview.save();

    listing.reviews.push(newReview._id); // Push ObjectId
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).send("Something went wrong");
  }
});




const { reviewSchema } = require('./schema');

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};








//  delete review route
app.delete("/listings/:id/reviews/:reviewID", async (req, res) => {
  const { id, reviewID } = req.params;

  // Remove review from Listing.reviews array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });

  // Delete the review from the Review collection
  await Review.findByIdAndDelete(reviewID);

  res.redirect(`/listings/${id}`);
});








// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("hi I am root");
});

app.use("/listings", listings);

app.get("/",(req,res)=>{
  res.send();
})
// LISTEN
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
