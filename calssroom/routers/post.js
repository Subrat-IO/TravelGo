const express = require("express");
const router = express.Router();

// GET /posts
router.get("/", (req, res) => {
    res.send("GET from post router");
});

// GET /posts/:id
router.get("/:id", (req, res) => {
    res.send(`GET post with ID: ${req.params.id}`);
});

// POST /posts
router.post("/", (req, res) => {
    res.send("POST from post router");
});

// DELETE /posts/:id
router.delete("/:id", (req, res) => {
    res.send(`DELETE post with ID: ${req.params.id}`);
});

module.exports = router;
