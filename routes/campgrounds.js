var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

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
    var newCamp = {name:nametoAdd, image:imagetoAdd, description:descriptiontoAdd, author:author, price:price};
    Campground.create(newCamp, function(err,newCamp_DB){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
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
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
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
});


module.exports = router;