var express = require('express');
const User = require('../models/User.model');
const isLoggedIn = require("../middleware/isLoggedIn")
var router = express.Router();
const fileUploader =  require("../config/cloudinary.js")

/* GET users listing. */


router.route('/profile/:id/edit', isLoggedIn,) 
.get((req, res)=> {
    const userId = req.session.currentUser
    const routeId = req.params.id
    User.findById(userId)
    .then((user)=>{
        if(userId._id === routeId){
            
            res.render("../views/user/profile-edit", user)

        } else {res.redirect("/auth/login")}
    })
})
.post( fileUploader.single("profilePic"),(req,res)=>{
    const id = req.session.currentUser._id
    const username = req.body.username
    const profilePic = req.file && req.file.path
    //console.log("pic/////////////////////////////", profilePic)
    User.findByIdAndUpdate(id, {profilePic, username},{new: true})
    .then((user)=>{
      res.redirect("/user/profile")
    })
    })



router.route('/profile', isLoggedIn,) 
.get((req, res)=> {
    const userId = req.session.currentUser
    User.findById(userId)
    .populate("reviews")
    .populate("comments")
    .then((user)=>{
       
        res.render('../views/user/profile', {user});
    })
})





module.exports = router;
