const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

// ======================
// ROOT ROUTE (INDEX + CREATE)
// ======================
router.route("/")
  // GET / → list all
  .get(listingController.index)
  // POST / → create new
  // Order matters: isLoggedIn → upload image → create listing
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    listingController.createListing
  );

// ======================
// NEW FORM
// ======================
router.route("/new")
  .get(isLoggedIn, listingController.renderNew);

// ======================
// SINGLE LISTING ROUTES (SHOW, UPDATE, DELETE)
// ======================
router.route("/:id")
  .get(listingController.showListing)
  .put(isLoggedIn, isOwner, listingController.updateListing)
  .delete(isLoggedIn, isOwner, listingController.deleteListing);

// ======================
// EDIT FORM
// ======================
router.route("/:id/edit")
  .get(isLoggedIn, isOwner, listingController.renderEdit);

module.exports = router;
