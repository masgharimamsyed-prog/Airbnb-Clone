const ReviewSchemaJoi = require("../Joi/review.js");
const review = require('../init/reviewmongoose.js');
const listing = require('../init/listingsmongoose.js');

module.exports.addingNewReview=async (req, res) => {
  let { comment, rating } = req.body;
  const temp = {
    comment,
    rating,
    owner: req.user._id.toString(),
  }
  let { _id } = await review.insertOne(temp);
  let result = await listing.findByIdAndUpdate(req.params.id, { $push: { reviews: (_id) } });
  if (!result) {
    req.flash("failure", "Listings You request for,does not exist!");
    res.redirect(`/listings/${req.params.id}`);
    return;
  }
  req.flash("success", "New Review Created Successfully!");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroySpecificReview= async (req, res) => {
  let reviewtobedel = await review.findById(req.params.reviewId);
  if (!reviewtobedel.owner.equals(req.user._id)) {
    req.flash("failure", "Review You request for,does not belong to you!");
    res.redirect(`/listings/${req.params.id}`);
    return;
  }
  await listing.findByIdAndUpdate(req.params.id, { $pull: { reviews: (req.params.reviewId) } });
  let result = await review.findByIdAndDelete(req.params.reviewId);

  if (!result) {
    req.flash("failure", "Review You request for,does not exist!");
    res.redirect(`/listings/${req.params.id}`);
    return;
  }

  req.flash("success", "Review deleted Successfully!");
  res.redirect(`/listings/${req.params.id}`);

};