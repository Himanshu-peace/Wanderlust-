const User = require("../models/user");


module.exports.signUPForm = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signUP = async (req,res) => {
    try{
    
        let {username ,email , password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser,(err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to wonderlust");
            res.redirect("/listings");

        })
    }catch(e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req,res) => {
    res.render("users/login.ejs")
};

module.exports.login = async (req,res) => {
    req.flash("success","welcome Back! logedin successful");
    // res.redirect("/listings");
    let redirectUrl = res.locals.redirectUrl || "/listings";   
    res.redirect(redirectUrl);
};

module.exports.logOut = (req,res,next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success" , "you are logged out!");
        res.redirect("/listings");
    })
};