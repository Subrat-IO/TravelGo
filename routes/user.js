const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

// =========================
// SIGNUP ROUTES
// =========================

// Signup GET
router.get("/signup", (req, res) => {
    res.render("users/signup");
});

// Signup POST
router.post("/signup", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        // Auto-login after signup
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to TravelGo!");
            res.redirect("/listings");
        });

        console.log("New user registered:", registeredUser.toJSON());
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

// =========================
// LOGIN ROUTES
// =========================

// Login GET
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Login POST (with async handling and fallback redirect)
router.post("/login", saveRedirectUrl, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash("error", info.message);
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome back to TravelGo!");
            res.redirect(res.locals.redirectUrl || "/listings");
        });
    })(req, res, next);
});

// =========================
// LOGOUT ROUTES
// =========================

// Logout POST (recommended)
router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out now!");
        res.redirect("/listings");
    });
});

// Optional: Logout GET (if you need simple links, but less secure)
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out now!");
        res.redirect("/listings");
    });
});

module.exports = router;
