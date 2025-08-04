const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware.js");

// INDEX ROUTE
router.get("/", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
});

// NEW FORM ROUTE
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW ROUTE
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author", select: "username" }, // ✅ get username only
    })
    .populate("owner", "username"); // ✅ get username only

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing, currentUser: req.user });
});



// CREATE ROUTE
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // assign owner
    await newListing.save();
    req.flash("success", "New listing created successfully");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.log("Listing creation error:", err);
    req.flash("error", "Failed to create listing");
    res.redirect("/listings/new");
  }
});

// EDIT FORM ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
  // ✅ listing already fetched in isOwner middleware
  const listing = req.listing;
  res.render("listings/edit.ejs", { listing });
});

// UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
});

// DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
});

module.exports = router;
