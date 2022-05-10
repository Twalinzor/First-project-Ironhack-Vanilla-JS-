const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Game = require("../models/Game.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const GamesApi = require("../services/gamesApi");
const gamesApiHandler = new GamesApi();
const Review = require("../models/Review.model");
const User = require("../models/User.model");

/* GET home page. */
// router.get("/", async (req, res) => {

//   gamesApiHandler
//   .getOneGame(466)
//     .then((game) => {
//       res.render("index", game);
//       })
// });

// router.get("/", async (req, res) => {
//   const reviews = await Review.find().populate("author").populate("game");
//   res.render("index", { reviews });
// });

// comment
// router.get("/", (req, res)=>{
//   Review.find().populate("game").populate("author")
//     .then((reviews)=>{
//       console.log(reviews)
//       res.render("index", {reviews})
//     })
// })

router.get("/", async (req, res)=>{
    let user
    if(req.session.currentUser){
        user = await User.findById(req.session.currentUser._id)
    }
    const popularUsers = await User.find().populate("reviews").sort({reviews: -1}).limit(3)
    const popularGames = await Game.find().populate("reviews").sort({reviews: -1}).limit(4)
    const reviewResult = await Review.find().sort({likes: -1}).populate("author").populate("game")
   if(req.session.currentUser){
       res.render("index", {reviewResult, popularGames, popularUsers, user})
   } else{
    res.render("index", {reviewResult, popularGames, popularUsers})
   }

})

module.exports = router;