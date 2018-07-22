var mongoose = require("mongoose");

var campgroundsSchema = new mongoose.Schema({
   name: String,
   image: String,  
   description: String,
   price: String,
   location: String,
   lat: Number,
   lng: Number,
   comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }   
    ],
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Campground", campgroundsSchema);
