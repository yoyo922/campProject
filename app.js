require('dotenv').config();

var express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User    = require("./models/user"),
    flash = require("connect-flash");
    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    
console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
//mongoose.connect('mongodb://peter:27n1g2l1@ds243501.mlab.com:43501/skycamp',  { useNewUrlParser: true });
//mongoose.connect('mongodb://localhost:27017/skyCamp',{ useNewUrlParser: true } )
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

//setting up passport
app.use(require("express-session")({
    secret: "peter is learning camp",
    resave: false,
    saveUninitialized: false
}));

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});


app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SKYCAMP STARTED");
});