const Listing = require("./models/listing.js");
const ExpressError =require("./utils/ExpressError.js");  
const {listingSchema } = require('./JoiSchema.js');
const { reviewSchema } = require('./JoiSchema.js');

module.exports.isLoggedIn = (req, res,next) => {
    // console.log(req.user); //this will check that if the user is logged in ot=r not
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        //redirect Url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","you are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",")
        // throw new ExpressError(400, error);
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",")
        // throw new ExpressError(400, error);
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}