const Listing = require("../models/listing");
const Review = require("../models/review");

// ADD REVIEW
module.exports.addReview = async (req, res) => {
  try {
    console.log("📩 REQ BODY:", req.body);
    console.log("👤 REQ USER:", req.user);

    const { id } = req.params;

    // 1. Check listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // 2. Validate review data
    const { review } = req.body;
    if (!review || !review.rating || !review.comment) {
      req.flash("error", "Please provide both rating and comment.");
      return res.redirect(`/listings/${id}`);
    }

    // 3. Create review
    const newReview = new Review(review);
    newReview.author = req.user._id;
    await newReview.save();

    // 4. Link review to listing WITHOUT triggering full validation
    listing.reviews.push(newReview._id);
    await listing.save({ validateBeforeSave: false });

    console.log("✅ Review added:", newReview);

    req.flash("success", "New review created successfully!");
    res.redirect(`/listings/${id}`);

  } catch (err) {
    console.error("❌ Error saving review:", err);
    req.flash("error", "Something went wrong while saving the review.");
    res.redirect(`/listings/${req.params.id}`);
  }
};

// DELETE REVIEW
module.exports.destroyReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    // Remove review reference
    await Listing.findByIdAndUpdate(
      id,
      { $pull: { reviews: reviewId } },
      { validateBeforeSave: false }
    );

    // Delete review document
    await Review.findByIdAndDelete(reviewId);

    console.log(`✅ Review ${reviewId} deleted from listing ${id}`);

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);

  } catch (err) {
    console.error("❌ Error deleting review:", err);
    req.flash("error", "Something went wrong while deleting the review.");
    res.redirect(`/listings/${req.params.id}`);
  }
};
