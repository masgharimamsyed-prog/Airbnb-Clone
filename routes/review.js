const express = require("express");
const router = express.Router({ mergeParams: true });

const reviewControllers=require("../Controllers/reviewsControllers.js");

//MIDDLEWARES
const { islogin } = require("../middlewares/islogin.js");

//ADDING NEW REVIEW
router.patch("/newReview", islogin, reviewControllers.addingNewReview)

//DELETE SPECIFIC REVIEW OF LSIT
router.delete("/review/:reviewId", islogin,reviewControllers.destroySpecificReview);



module.exports = router;