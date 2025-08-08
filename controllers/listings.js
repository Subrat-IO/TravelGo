const Listing = require("../models/listing");

// ======================
// INDEX ROUTE
// ======================
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

// ======================
// RENDER NEW LISTING FORM
// ======================
module.exports.renderNew = (req, res) => {
  res.render("listings/new.ejs");
};

// ======================
// SHOW SINGLE LISTING
// ======================
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author", select: "username" },
    })
    .populate("owner", "username");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing, currentUser: req.user });
};

// ======================
// CREATE LISTING
// ======================
module.exports.createListing = async (req, res) => {
  try {
    const newListing = new Listing({
      ...req.body.listing,
      owner: req.user._id,
      image: { url: req.file?.path, filename: req.file?.filename }
    });
    await newListing.save();
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    res.redirect("/listings/new");
  }
};


// ======================
// RENDER EDIT LISTING FORM
// ======================
module.exports.renderEdit = async (req, res) => {
  const listing = req.listing; // fetched in isOwner middleware
  res.render("listings/edit.ejs", { listing });
};

// ======================
// UPDATE LISTING
// ======================
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
};

// ======================
// DELETE LISTING
// ======================
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
};
