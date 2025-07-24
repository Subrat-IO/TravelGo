const express = require("express");
const app = express();

// Import routers
const userRoutes = require("./routers/user");
const postRoutes = require("./routers/post");


app.get("/getcookies", (req, res) => {
    res.cookie("greet",
        "Hello"
    )
    res.send("sent you some cookies")
})

// Middleware to parse JSON
app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.send("Hi I am root user");
});

// Mount routes
app.use("/users", userRoutes);  // All user-related routes
app.use("/posts", postRoutes);  // All post-related routes

app.get("/admin",)


// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
