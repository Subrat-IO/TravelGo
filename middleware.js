// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Save the page they were trying to access
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "You must login to access this page!");
        return res.redirect("/login");
    }
    next();
};

// Move saved redirect URL to res.locals for use after login
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; // ✅ Clear after use
    }
    next();
};
