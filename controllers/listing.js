const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});  // find all Listings
    // res.send("sucessfull");   // testing
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewListing = (req, res) => {
    // res.send("sucessfull");
    // console.log(req.user);       //users data
    
res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id}= req.params;
    const listing = await Listing.findById(id)
       .populate({
          path: "reviews",
          populate: {
            path: "author"
          },
       })
       .populate("owner") 
    ;   
    
    if(!listing){
      req.flash("error","Listing not found");
      res.redirect("/listing");
    };
    // res.send("sucessfull");
    res.render("./listings/show.ejs",{listing});
}

module.exports.createNewListing = async (req, res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url ,filename};
    await newListing.save();
    req.flash("success","New Listing created");
    res.redirect("/listings");
}

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // res.send("root is working");
    if(!listing){
        req.flash("error","Listing not found");
        res.redirect("/listing");
    };
    res.render("./listings/edit.ejs",{listing})
}

module.exports.updateListing = async (req,res)=>{

    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    // console.log(updatedListing);
    if(typeof req.file !== undefined){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url ,filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    // res.send("root is working");
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}