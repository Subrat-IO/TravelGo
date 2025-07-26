const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// Import routers
const userRoutes = require("./routers/user");
const postRoutes = require("./routers/post");

// Route to set and log cookies
app.get("/getcookies", (req, res) => {
    // Set cookies
    res.cookie("greet", "Hello");
    res.cookie("made_in", "India");

    // Log cookies from client
    console.log("Cookies received from client:", req.cookies);

    res.send("Sent you some cookies. Refresh to see them in the console.");
});

// Separate route to view client cookies
app.get("/showcookies", (req, res) => {
    console.log("Client cookies:", req.cookies);
    res.json(req.cookies);
});

// Root route
app.get("/", (req, res) => {
    res.send("Hi I am root user");
});

// Fixed /admin route
app.get("/admin", (req, res) => {
    res.send("Welcome to the admin panel.");
});

// Mount routes
app.use("/users", userRoutes);  // All user-related routes
app.use("/posts", postRoutes);  // All post-related routes

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
