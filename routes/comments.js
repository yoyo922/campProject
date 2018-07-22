var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//new comment form
router.get("/new",middleware.isloggedIn ,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground: foundCampground});
        }
    });
});
// new comment route
router.post("/", middleware.isloggedIn,function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error","Error in databse");
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log("failed to create comment "+ err);
                }else{
                    //add username and id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash("success", "Sucessfully added comment");
                    res.redirect("/campgrounds/" + foundCampground.id);
                }
            });
        }
    });
});

//edit comment route

router.get("/:comments_id/edit",middleware.checkCommentOwner ,function(req,res){
   Comment.findById(req.params.comments_id, function(err, foundComment) {
       if(err){
           res.redirect("back");
       }else{
           res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
       }
   });
});
//update route
router.put("/:comment_id",middleware.checkCommentOwner,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
          req.flash("success", "You updated your comment")
          res.redirect("/campgrounds/"+ req.params.id);  
        }
    });
});

//destory route
router.delete("/:comment_id",middleware.checkCommentOwner,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//middleware function
module.exports = router;