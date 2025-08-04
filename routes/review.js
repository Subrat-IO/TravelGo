const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const { reviewSchema } = require("../schema");
const { isLoggedIn, isReviewAuthor } = require("../middleware"); // ✅ Import middleware

// Validate Review Middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

// POST: Add Review
router.post("/", isLoggedIn, validateReview, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).send("Listing not found");

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();

    listing.reviews.push(newReview);
    await listing.save();

    req.flash("success", "New review created successfully");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).send("Something went wrong");
  }
});

// DELETE: Remove Review (Only Author Can Delete)
router.delete("/:reviewID", isLoggedIn, isReviewAuthor, async (req, res) => {
  const { id, reviewID } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
  await Review.findByIdAndDelete(reviewID);

  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
});

module.exports = router;
