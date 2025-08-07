const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// ======================
// ROOT ROUTE (INDEX + CREATE)
// ======================
router.route("/")
  .get(listingController.index)                 // GET / → list all
  .post(isLoggedIn, listingController.createListing); // POST / → create new

// ======================
// NEW FORM
// ======================
router.route("/new")
  .get(isLoggedIn, listingController.renderNew); // GET /new → show form

// ======================
// SINGLE LISTING ROUTES (SHOW, UPDATE, DELETE)
// ======================
router.route("/:id")
  .get(listingController.showListing)                 // GET /:id → show
  .put(isLoggedIn, isOwner, listingController.updateListing) // PUT /:id → update
  .delete(isLoggedIn, isOwner, listingController.deleteListing); // DELETE /:id → delete

// ======================
// EDIT FORM
// ======================
router.route("/:id/edit")
  .get(isLoggedIn, isOwner, listingController.renderEdit); // GET /:id/edit → show edit form

module.exports = router;
