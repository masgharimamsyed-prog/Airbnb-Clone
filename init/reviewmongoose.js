const ReviewSchema=require("../models/review.js");
const mongoose = require('mongoose');



mongoose.connect(process.env.ATLASMD)
    .then(() => console.log('Connected successfully to Mongo (for Reviews)!'));




const review = mongoose.model('review', ReviewSchema);

module.exports=review;


