const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const { reviewSchema } = require("../schema"); // Joi schema
const { isLoggedIn, isReviewAuthor } = require("../middleware"); // Auth middlewares

const reviewController = require("../controllers/reviews");

// ✅ Validate Review Middleware with Flash
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    // Combine all Joi error messages into one string
    const msg = error.details.map(el => el.message).join(", ");
    req.flash("error", msg); 
    return res.redirect(`/listings/${req.params.id}`);
  }
  next();
};

// ✅ POST: Add Review
router.post("/", isLoggedIn, validateReview, (reviewController.addReview) );

// ✅ DELETE: Remove Review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, (reviewController.destroyReview));

module.exports = router;
