const express = require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError =require("../utils/ExpressError.js");  
const {listingSchema } = require('../JoiSchema.js');   //requireing listing validation Schema and review validation Schema
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js"); //middlewares
const listingController = require("../controllers/listing.js");//controller listing.js 
const {storage} = require("../cloudConfigure.js"); //cloudconfig File
const multer  = require('multer')//multer for files to parse and store automatically
// const upload = multer({ dest: 'uploads/' }) //stores in loacl storage
const upload = multer({ storage }) //stores in cloudinary


//listings routes
//Index route
router.get("/",wrapAsync (listingController.index));

//new route
router.get("/new", isLoggedIn , listingController.renderNewListing);

//show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
router.post("/",
    isLoggedIn,
    upload.single("listing[image]"),
    // validateListing, not working (listing is required)
    wrapAsync(listingController.createNewListing)
);
// router.post("/",upload.single("listing[image]"), (req,res) => {
//     res.send(req.file);
// })

//edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing));

//Update route
router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync (listingController.updateListing));

//Delete route
router.delete("/:id",
    isOwner,
    wrapAsync(listingController.destroyListing));

module.exports = router;

