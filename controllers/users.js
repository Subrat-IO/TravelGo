const User = require("../models/user");

// =========================
// SIGNUP CONTROLLERS
// =========================

// GET: Render Signup Form
module.exports.renderSignup = (req, res) => {
  res.render("users/signup");
};

// POST: Handle Signup
module.exports.signup = async (req, res, next) => {
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
};

// =========================
// LOGIN CONTROLLERS
// =========================

// GET: Render Login Form
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

// POST: Handle Login (with redirect)
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to TravelGo!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// =========================
// LOGOUT CONTROLLERS
// =========================

// POST/GET: Logout User
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out now!");
    res.redirect("/listings");
  });
};
