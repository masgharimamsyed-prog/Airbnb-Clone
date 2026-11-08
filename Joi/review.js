const Joi = require('joi');

const ReviewSchemaJoi = Joi.object({


  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().required(),
  personName: Joi.string().required,
  owner: Joi.string().hex().length(24).required(),
})

module.exports = ReviewSchemaJoi;