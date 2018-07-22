var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//campground routes
router.get("/", function(req,res){
    res.render("landing");
});

//Authenticate routes
router.get("/register", function(req,res){
    res.render("register");
});
//regsiter route
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
       if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
        req.flash("success", "Successfully Registered.Welcome " +req.body.username );
        res.redirect("/campgrounds"); 
        });
    });
});

//login form
router.get("/login", function(req,res){
    res.render("login");
});

//login route
router.post("/login",passport.authenticate("local", 
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login",
        failureFlash : true
    }) , function(req, res) {
});

//logout
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success", "You are logged Out");
    res.redirect("/campgrounds");
});

module.exports = router;