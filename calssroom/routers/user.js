const express = require("express");
const router = express.Router();

// GET /users
router.get("/", (req, res) => {
    res.send("GET from user router");
});

// GET /users/:id
router.get("/:id", (req, res) => {
    res.send(`GET user with ID: ${req.params.id}`);
});

// POST /users
router.post("/", (req, res) => {
    res.send("POST from user router");
});

// DELETE /users/:id
router.delete("/:id", (req, res) => {
    res.send(`DELETE user with ID: ${req.params.id}`);
});

module.exports = router;
