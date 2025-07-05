const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define image as an embedded object
const imageSchema = new Schema({
  url: String,
  filename: String
}, { _id: false }); // prevent auto _id for nested schema

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: imageSchema, // 👈 Now it's an object, matching your data
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
