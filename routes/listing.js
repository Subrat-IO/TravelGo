const express = require("express");
const { route } = require("../classroom/routers/user");
const router = express.Router();
const Listing = require("../models/listing"); // or the correct path to your model


// INDEX ROUTE
router.get("/", async (req, res) => {
  let allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing }); // ✅ "./" not required
});

// NEW FORM ROUTE
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

 // SHOW ROUTE
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(req.params.id).populate("reviews");
  res.render("listings/show.ejs", { listing });
});

// .......

// CREATE ROUTE
router.post("/", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// EDIT FORM ROUTE
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/edit.ejs", { listing });
});



// UPDATE ROUTE
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing, {
    runValidators: true,
  });
  res.redirect(`/listings/${id}`);
});

// DELETE ROUTE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

module.exports  = router;