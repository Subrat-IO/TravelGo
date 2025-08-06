const Listing = require("../TravelGo/models/listing");
const Review = require("../TravelGo/models/review"); // ✅ Import Review

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Save the page they were trying to access
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "You must login to access this page!");
        return res.redirect("/login");
    }
    next();
};

// Move saved redirect URL to res.locals for use after login
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; // ✅ Clear after use
    }
    next();
};

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
  req.listing = listing; // ✅ attach listing to request for next middleware/route
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params; // ✅ must match route

  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }

  req.review = review; // ✅ attach review to request
  next();
};

