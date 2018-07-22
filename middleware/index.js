// mid ware
var middlewareObj = {};

var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

middlewareObj.checkCampOwner = function(req,res,next){
       if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "error not found in database");
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next(); 
                }
                else{
                    req.flash("error", "You can only edit your own campground");
                    res.redirect("back");
                }
            }
        });   
    }else{
        req.flash("error","You have to Login first");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "error not found in database");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();   
                }
                else{
                    req.flash("error", "You can only edit your own comment");
                    res.redirect("back");
                }
            }
        });   
    }else{
        req.flash("error","You have to log in first");
        res.redirect("back");
    }
};

middlewareObj.isloggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You have to login first");
    res.redirect("/login");
};

module.exports = middlewareObj;