const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// Signup GET route
router.get("/signup", (req, res) => {
    res.render("users/signup");
});

// Signup POST route
router.post("/signup", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password); // ✅ only once

        req.login(registeredUser, (err) => { // ✅ auto login after signup
            if (err) return next(err);
            req.flash("success", "Welcome to TravelGo");
            res.redirect("/listings");
        });
        console.log("New user registered:", registeredUser.toJSON());
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

module.exports = router;
