const Joi = require("joi");
const review = require("./models/review");

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required(),  // fixed here
  }).required()
});
 