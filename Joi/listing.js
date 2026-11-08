const Joi = require('joi');

const ListingSchemaJoi = Joi.object({
  title: Joi.string().required(),

  description: Joi.string().required(),

  price: Joi.number().integer().min(1),

  location: Joi.string().required(),

  country: Joi.string().required(),

  image: Joi.object({
    filename: Joi.string(),
    url: Joi.string(),
  }),
  owner: Joi.string().hex().length(24).required(),

  geometry: Joi.object({
    type: Joi.string()
      .valid("Point")
      .required(),

    coordinates: Joi.array()
      .items(Joi.number())
      .length(2)
      .required()
  }).required()
})

module.exports = ListingSchemaJoi;