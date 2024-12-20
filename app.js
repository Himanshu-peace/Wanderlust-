if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express  = require("express");
const app = express();
const mongoose = require('mongoose');
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
// const wrapAsync =require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");  
// const {listingSchema , reviewSchema} = require('./JoiSchema.js');   //requireing listing validation Schema and review validation Schema
const session = require("express-session");
const MongoStore = require('connect-mongo'); //for storing session in deployment state
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrstegy = require("passport-local");
const User = require("./models/user.js");  //User Schema
// const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust"  //mongo compass localdatabase url
const dbUrl = process.env.ATLASDB_URL;  //mongoAtlas connect string url
//requiring listings and review Routes
const listingsRouter = require("./routes/listing.js");
const reveiwsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs", ejsMate);

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.static("public/CSS"));
app.use(express.static(path.join(__dirname,"/public")));

main().then((res) => {
    console.log("connection sucessful");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

//mongoStore options
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error",() => {
    console.log("ERROR in MONGO SESSION STORE",err);
})

//session and flash middleware
app.use(session(
    {
        store: store,
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            epires: Date.now() + 7*24*60*60*1000,  //in milli seconds
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
        }
    }
));
app.use(flash());

//express-session is required for passport
//setting passport for Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrstegy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//home page 
// app.get("/",(req,res)=>{
//     res.send("welcome to wanderlust");
// });

//middleware for flash messages (res.locals middleware)
app.use((req,res,next) => {
    res.locals.success = req.flash("success"); //available for every template without rendering
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    // console.log(res.locals.success);
    // res.locals.errorMsg = req.flash("error");
    next();
});

//setting demouser using passport 

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gamail.com",
//         username: "delta-student" //passport automatically add username in user schema
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");    //(username,"with password")
//     res.send(registeredUser);
// });


//listing/reviews/user routes
app.use("/listings", listingsRouter),
app.use("/listings/:id/reviews", reveiwsRouter ),
app.use("/", userRouter ),

// for wrong route page not found middleware
app.all("*",(req,res,next)=> {
    next(new ExpressError(404,"page not found!"));
});

// err handler

app.use((err,req,res,next)=> {
    let {status=500,message= "Something went wrong"} = err;
    // res.render("error.ejs",{err})
    res.status(status).render("error.ejs",{message});
    // res.status(status).send(message);
});

app.listen("8080", ()=>{
    console.log(`app is listning to 8080`);
});
