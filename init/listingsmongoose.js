const listingSchema = require("../models/listing");
const mongoose = require("mongoose");

mongoose.connect(process.env.ATLASMD)
    .then(() => console.log('Connected successfully to Mongo (for Listings)!'));


const listing = mongoose.model("Listing", listingSchema, "listings");

module.exports = listing;