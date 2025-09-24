const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// ======================
// INDEX ROUTE
// ======================
module.exports.index = async (req, res) => {
  try {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  } catch (err) {
    console.error(err);
    req.flash("error", "Cannot fetch listings");
    res.redirect("/");
  }
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
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("owner", "username")
      .populate({
        path: "reviews",
        populate: { path: "author", select: "username" },
      });

    if (!listing) {
      req.flash("error", "Listing you requested does not exist");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {
      listing,
      currentUser: req.user,
      mapToken: process.env.MAP_TOKEN,
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Cannot show listing");
    res.redirect("/listings");
  }
};

// ======================
// CREATE LISTING
// ======================
module.exports.createListing = async (req, res) => {
  try {
    const response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    if (!response.body.features.length) {
      req.flash("error", "Location not found");
      return res.redirect("/listings/new");
    }

    const newListing = new Listing({
      ...req.body.listing,
      owner: req.user._id,
      image: {
        url: req.file?.path || "",
        filename: req.file?.filename || "",
      },
      geometry: response.body.features[0].geometry,
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
// RENDER EDIT LISTING FORM
// ======================
module.exports.renderEdit = async (req, res) => {
  try {
    const listing = req.listing; // fetched in isOwner middleware

    if (listing.image?.url) {
      // Cloudinary optimization
      listing.image.optimizedUrl = listing.image.url.replace(
        "/upload/",
        "/upload/q_auto,f_auto,w_600/"
      );
    }

    res.render("listings/edit.ejs", { listing });
  } catch (err) {
    console.error(err);
    req.flash("error", "Cannot edit listing");
    res.redirect("/listings");
  }
};

// ======================
// UPDATE LISTING
// ======================
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // Update fields
    listing.set(req.body.listing);

    // Replace image if new file uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (listing.image?.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
      }

      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();

    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Error updating listing");
    res.redirect("/listings");
  }
};

// ======================
// DELETE LISTING
// ======================
module.exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // Delete image from Cloudinary if exists
    if (listing.image?.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    // Delete listing from DB
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Error deleting listing");
    res.redirect("/listings");
  }
};