const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const users = require("../controllers/users");

// =========================
// SIGNUP ROUTES
// =========================
router.get("/signup", users.renderSignup);
router.post("/signup", users.signup);

// =========================
// LOGIN ROUTES
// =========================
router.get("/login", users.renderLogin);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
  }),
  users.login
);

// =========================
// LOGOUT ROUTES
// =========================
router.post("/logout", users.logout);
router.get("/logout", users.logout); // Optional

module.exports = router;
