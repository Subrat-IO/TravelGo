const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

// Connect to MongoDB
async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
}

main()
    .then(() => console.log("MongoDB connection successful"))
    .catch((err) => console.log("MongoDB connection error:", err));

const initDB = async () => {
    try {
        // Clear existing listings
        await Listing.deleteMany({});
        console.log("Previous data deleted");

        // Add owner to each listing
        const dataWithOwner = initData.data.map((obj) => ({
            ...obj,
            owner: "688d0055f5a0eb69c8a68a5e", // Replace with a valid user _id from your DB
        }));

        // Insert the new data
        await Listing.insertMany(dataWithOwner);
        console.log("Data initialized successfully");

    } catch (err) {
        console.log("Error initializing DB:", err);
    } finally {
        // Close connection
        mongoose.connection.close();
        console.log("DB connection closed");
    }
};

// Run the seed function
initDB();
