var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//campgrouds
router.get("/", function(req,res){
    Campground.find({},function(err, campgrounds_fromDB){
       if(err){
           console.log(err);
       }else{
           res.render("./campgrounds/index",{campgrounds:campgrounds_fromDB, page: 'campgrounds'});
       }
    });
});
//new campground form
router.get("/new",middleware.isloggedIn, function(req, res) {
    res.render("./campgrounds/new");
});

//new campground post route
router.post("/",middleware.isloggedIn,function(req,res){
    var nametoAdd = req.body.name;
    var imagetoAdd = req.body.image;
    var price = req.body.price;
    var descriptiontoAdd = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        
        var newCamp = {name:nametoAdd, image:imagetoAdd, description:descriptiontoAdd, location:location, lng:lng, lat:lat,  author:author, price:price};
        Campground.create(newCamp, function(err,newCamp_DB){
            if(err){
                console.log(err);
            }else{
                res.redirect("/campgrounds");
            }
        });
    });
});

//SHOW ROUTE
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground}); 
        }
    });
});

//EDIT route
router.get("/:id/edit", middleware.checkCampOwner,function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
          if(err){
              req.flash("error","Not found in database");
          }
          res.render("campgrounds/edit", {campground: foundCampground});   
    });
});

//UPDATE route

router.put("/:id",middleware.checkCampOwner,function(req,res){
    console.log(req.body.campground.location);
    geocoder.geocode(req.body.campground.location, function (err, data) {
        if (err || !data.length) {
          console.log("ERROR IS " + err);
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
            if(err){
                res.redirect("/campgrounds");
            }else{
                res.redirect("/campgrounds/" + req.params.id);
            }
         });
    });
});

//delete route

router.delete("/:id",middleware.checkCampOwner, function(req,res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else{
           req.flash("success","You deleted the campground");
           res.redirect("/campgrounds");
       }
   });
   /*router.delete("/:id", isLoggedIn, checkUserCampground, function(req, res) {
    Comment.remove({
      _id: {
        $in: req.campground.comments
      }
    }, function(err) {
      if(err) {
          req.flash('error', err.message);
          res.redirect('/');
      } else {
          req.campground.remove(function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('/');
            }
            req.flash('error', 'Campground deleted!');
            res.redirect('/campgrounds');
          });
      }
    })*/
});

module.exports = router;