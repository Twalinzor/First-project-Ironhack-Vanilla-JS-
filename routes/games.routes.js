const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Game = require("../models/Game.model");

const fileUploader =  require("../config/cloudinary.js")

const isLoggedIn = require("../middleware/isLoggedIn");
const GamesApi = require("../services/gamesApi");
const gamesApiHandler = new GamesApi();
const Review = require("../models/Review.model");
const User = require("../models/User.model");

router
  .route("/:gameId/details/create-review")
  .get(isLoggedIn, (req, res, next) => {
    const id = req.params.gameId;
    
    gamesApiHandler.getOneGame(id).then((game) => {
      let gameDetail = { gameFromDB: game };

      res.render("reviews/create-review", { gameDetail: game });
    });
  })
  .post(isLoggedIn,  fileUploader.single("imageUrl"), (req, res, next) => {
    const apiId = req.params.gameId;
    const authorId = req.session.currentUser;
    const imageUrl = req.file && req.file.path
    

    
    const { title, description, videoUrl } = req.body;

    Game.findOne({ id: apiId }).then((game) => {
      
      Review.create({ title, imageUrl, videoUrl, author: authorId, description, game: game._id })
        .then((review) => {
          User.findOneAndUpdate(
            { _id: authorId },
            { $push: { reviews: review } }, //PASAR SOLO REVIEW_ID
            { new: true }
          ).then(() => {
            Game.findOneAndUpdate(
              { id: apiId },
              { $push: { reviews: review } }, //PASAR SOLO REVIEW_ID
              { new: true }
            ).then(() => {
              res.redirect("/reviews?page=1&limit=16");
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

router.get("/:gameId/details", (req, res) => {
  const apiId = req.params.gameId;

  if(req.session.currentUser){
    User.findById(req.session.currentUser._id)
    .then((user)=>{
      Game.findOne({id: apiId})
      .populate({
       path : 'reviews',
       populate : {
         path : 'author'
       }})
     
     .then((dbGame) => {
     gamesApiHandler
       .getOneGame(apiId)
       .then((game) => {
         
         res.render("games/oneGame", { gameDetail: game, dbGame, user });
       });
     })

    })}else{

      Game.findOne({id: apiId})
       .populate({
        path : 'reviews',
        populate : {
          path : 'author'
        }})
      
      .then((dbGame) => {
      gamesApiHandler
        .getOneGame(apiId)
        .then((game) => {
          
          res.render("games/oneGame", { gameDetail: game, dbGame });
        });
      })

    }


});

// GAMES BY GENRE


router.get("/genre", (req, res)=>{
  
  let {page, genre} = req.query
  page = parseInt(page)
  if(page <=0) page=1;
 
  const nextPage = page + 1
  const previousPage = page - 1 
  const limit = 16

  const startIndex = (page -1) * limit;
  const endIndex = page * limit

  if(req.session.currentUser){
    User.findById(req.session.currentUser._id)
    .then((user)=>{
      gamesApiHandler
      .getGameByGenre(genre)
        .then((games)=>{
          
          if(page >= (games.length/limit) ) page = Math.floor(games.length/limit)
          const resultGameList = games.slice(startIndex,endIndex)
  
          res.render("games/gameByGenre", {genre, resultGameList, previousPage, nextPage, user})
  
        }).catch((err) =>console.log(err))

    })} else {
      gamesApiHandler
        .getGameByGenre(genre)
          .then((games)=>{
            
            if(page >= (games.length/limit) ) page = Math.floor(games.length/limit)
            const resultGameList = games.slice(startIndex,endIndex)
    
            res.render("games/gameByGenre", {genre, resultGameList, previousPage, nextPage})
    
          }).catch((err) =>console.log(err))

    }

})



// PAGINATION

router.get("/", (req, res) => {
  console.log("asdfsaf")
  let page = req.query.page
  page = parseInt(page)
  if(page <=0) page=1;
  if(page >= 23) page = 23
  const nextPage = page + 1
  const previousPage = page - 1 
  const limit = 16

  const startIndex = (page -1) * limit;
  const endIndex = page * limit
if(req.session.currentUser){
  User.findById(req.session.currentUser._id)
  .then((user)=>{
    Game.find()
    .then((games) => {
      
      const resultGameList = games.slice(startIndex,endIndex)
      
      res.render("games/gameList", {resultGameList, previousPage, nextPage, user} );
      
    
    })

  }).catch((err) => {
    console.log(err);
  })
}else {
  
  Game.find()
  .then((games) => {
    
    const resultGameList = games.slice(startIndex,endIndex)
    
    res.render("games/gameList", {resultGameList, previousPage, nextPage} );
    
  
  })
  .catch((err) => {
    console.log(err);
  });
}
   
});






module.exports = router;
