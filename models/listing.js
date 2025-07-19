const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String
}, { _id: false });

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: imageSchema,
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
