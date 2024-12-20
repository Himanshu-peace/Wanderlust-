const express = require("express");
const router = express.Router({mergeParams:true});  //merge params is used to take data from app.js to review routes

const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError =require("../utils/ExpressError.js");  
const { reviewSchema} = require('../JoiSchema.js');   //requireing listing validation Schema and review validation Schema
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const {validateReview,isLoggedIn} = require("../middleware.js");

const reviewController = require("../controllers/review.js")



// post review routes
router.post("/",  
    isLoggedIn,
    validateReview ,
    wrapAsync(reviewController.postReview)
)

//delete review route

router.delete("/:reviewId",
    isLoggedIn,
    wrapAsync(reviewController.destroyReview))

module.exports = router;
