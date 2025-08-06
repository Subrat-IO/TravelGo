const Listing = require("../TravelGo/models/listing");
const Review = require("../TravelGo/models/review");
const { reviewSchema } = require("../TravelGo/schema"); // ✅ Import Joi schema

// =========================
// AUTHENTICATION MIDDLEWARE
// =========================

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; 
    req.flash("error", "You must login to access this page!");
    return res.redirect("/login");
  }
  next();
};

// Save redirect URL to res.locals for use after login
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl; // ✅ Clear after use
  }
  next();
};

// =========================
// LISTING MIDDLEWARE
// =========================

// Check if current user owns the listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/listings/${id}`);
  }
  req.listing = listing; // ✅ Attach listing to request
  next();
};

// =========================
// REVIEW MIDDLEWARE
// =========================

// Validate Review with Joi and Flash Message
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    req.flash("error", msg);
    return res.redirect(`/listings/${req.params.id}`);
  }
  next();
};

// Check if the current user is the review author (safe version)
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  // ✅ Defensive check: ensure author exists before calling .equals
  if (!review.author || !review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }

  req.review = review; // ✅ Attach review to request
  next();
};
