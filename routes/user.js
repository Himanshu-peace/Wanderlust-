const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userontroller = require("../controllers/user")

router.get("/signup", userontroller.signUPForm)

router.post("/signup", wrapAsync(userontroller.signUP));

router.get("/login",userontroller.loginForm )

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect: '/login',failureFlash:true}),
    userontroller.login );

router.get("/logout" ,userontroller.logOut )


module.exports= router;