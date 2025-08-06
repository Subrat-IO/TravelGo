const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// INDEX ROUTE
router.get("/", listingController.index);

// NEW FORM ROUTE
router.get("/new", isLoggedIn, listingController.renderNew);

// SHOW ROUTE
router.get("/:id", listingController.showListing);

// CREATE ROUTE
router.post("/", isLoggedIn, listingController.createListing);

// EDIT FORM ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEdit);

// UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, listingController.updateListing);

// DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, listingController.deleteListing);

module.exports = router;
