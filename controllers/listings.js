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
      image: {
        url: req.file?.path,
        filename: req.file?.filename
      }
    });
    await newListing.save();
    req.flash("success", "New listing created successfully");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Error creating listing");
    res.redirect("/listings/new");
  }
};

// ======================
// RENDER EDIT LISTING FORM (with Cloudinary quality change)
// ======================
module.exports.renderEdit = async (req, res) => {
  const listing = req.listing; // fetched in isOwner middleware

  if (listing.image?.url) {
    // Cloudinary image transformation for better performance
    listing.image.optimizedUrl = listing.image.url.replace(
      "/upload/",
      "/upload/q_auto,f_auto,w_600/"
    );
  }

  res.render("listings/edit.ejs", { listing });
};

// ======================
// UPDATE LISTING (now with file upload support)
// ======================
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // Update basic fields
  listing.set(req.body.listing);

  // If new image uploaded, replace old one
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await listing.save();

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

// listingsController.js
module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" }
    });

  res.render("listings/show", {
    listing,
    currentUser: req.user,
    mapToken: process.env.MAP_TOKEN // ✅ pass here
  });
};
