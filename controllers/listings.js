const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
      req.flash('error', 'Location not found');
      return res.redirect('/listings/new');
    }

    const newListing = new Listing({
      ...req.body.listing,
      owner: req.user._id,
      image: {
        url: req.file?.path || '',
        filename: req.file?.filename || '',
      },
      geometry: response.body.features[0].geometry,
    });

    await newListing.save(); // save but no console.log

    req.flash("success", "New listing created successfully");
    res.redirect(`/listings/${newListing._id}`); // use newListing._id directly
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

  const listing = await Listing.findById(id);

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
      filename: req.file.filename,
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
