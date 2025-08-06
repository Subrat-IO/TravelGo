const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const { reviewSchema } = require("../schema"); // Joi schema
const { isLoggedIn, isReviewAuthor,validateReview } = require("../middleware"); // Auth middlewares

const reviewController = require("../controllers/reviews");



// ✅ POST: Add Review
router.post("/", isLoggedIn, validateReview, (reviewController.addReview) );

// ✅ DELETE: Remove Review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, (reviewController.destroyReview));

module.exports = router;
