var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");

var data = [
    {
        name: "Rock Cayon",
        image: "http://www.clearwatervalley.com/typo3temp/pics/8144a03b99.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse lacinia, massa non venenatis volutpat, elit dolor rhoncus felis, ac pretium sapien odio eget diam. Sed viverra nulla id eleifend dapibus. Etiam non congue nibh, quis aliquam urna. Aliquam mattis non metus interdum convallis. Sed et erat quam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut vel elementum tellus, vitae porta augue."
    },
    {  
        name: "Star Camp",
        image: "https://www.pc.gc.ca/en/pn-np/ab/banff/activ/camping/~/media/802FD4AF791F4C6886E18CBF4A2B81B2.ashx?w=595&h=396&as=1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse lacinia, massa non venenatis volutpat, elit dolor rhoncus felis, ac pretium sapien odio eget diam. Sed viverra nulla id eleifend dapibus. Etiam non congue nibh, quis aliquam urna. Aliquam mattis non metus interdum convallis. Sed et erat quam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut vel elementum tellus, vitae porta augue."
    },
    {
        name: "Cosy Camp",
        image: "http://www.loneconetrail.ca/sites/default/files/styles/header/public/header_images/campground-v2.jpg?itok=fqhTCtod",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse lacinia, massa non venenatis volutpat, elit dolor rhoncus felis, ac pretium sapien odio eget diam. Sed viverra nulla id eleifend dapibus. Etiam non congue nibh, quis aliquam urna. Aliquam mattis non metus interdum convallis. Sed et erat quam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut vel elementum tellus, vitae porta augue."
    },
    
];

function seedDB(){
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed campgrounds");
        data.forEach(function(seed){
            Campground.create(seed, function(err,campground){
                if(err){
                    console.log(err);
                }else{
                    console.log("added a campground");
                    Comment.create(
                    {
                        text: "I like this place, I wish there was internet",
                        author: "Peter"                            
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        }else{
                            campground.comments.push(comment);
                            campground.save();
                        }
                    });
                }
            });
        });
    });
}

module.exports = seedDB;