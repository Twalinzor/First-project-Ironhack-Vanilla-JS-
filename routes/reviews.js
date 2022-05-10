const Review = require("../models/Review.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

const GamesApi = require("../services/gamesApi");
const gamesApiHandler = new GamesApi();
const fileUploader =  require("../config/cloudinary.js")

const router = require("express").Router();
const mongoose = require("mongoose");

const isLoggedOut = require("../middleware/isNotLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");




router.get('/:reviewId/details', isLoggedIn,(req, res)=> {
  const reviewId = req.params.reviewId
  let userLiked = false;
  let userNotLiked = false;
  let hasVideo = true

  
 
  Review.findById(reviewId)
  .populate(["author","game","likes","comments"])
  .then((review)=>{
    
    User.findById(req.session.currentUser)
    .then((user)=>{
     if(review.likes.includes(user.username)){
       userLiked = true
     } else{ userNotLiked = true}
     if(review.videoUrl == ""){hasVideo = false}
     console.log(hasVideo)
      res.render("../views/reviews/oneReview", {review, userLiked, userNotLiked, hasVideo, user})
    })
  })
})

router.route('/:reviewId/likes', isLoggedIn,) 
.get((req, res)=> {
  const reviewId = req.params.reviewId
  const userId = req.session.currentUser
  User.findById(userId)
  .then((user)=>{

    Review.findOneAndUpdate(
      {_id : reviewId},
      { $push: { likes: user.username } },
      { new: true })
      .then(()=>{res.redirect(`/reviews/${reviewId}/details`)})
  })
})
router.route('/:reviewId/notlikes', isLoggedIn,) 
.get((req, res)=> {
  const reviewId = req.params.reviewId
  const userId = req.session.currentUser
  User.findById(userId)
  .then((user)=>{

    Review.findOneAndUpdate(
      {_id : reviewId},
      { $pull: { likes: user.username } },
      { new: true })
      .then(()=>{res.redirect(`/reviews/${reviewId}/details`)})
  })
})


router.get('/:reviewId/delete', isLoggedIn,(req, res)=> {
  //console.log("===============================================>>>> entro aca")      
  const userId = req.session.currentUser
  const reviewId = req.params.reviewId
  Review.findById(reviewId)
  .populate("author")
  .then((review)=>{
    //  console.log("useID====>", userId.username, "review author ====>", review.author.username)   
    if(userId.username === review.author.username){
      Review.findByIdAndRemove(reviewId).then(()=>{res.redirect(`/reviews/${userId._id}/user-list`)})
         // console.log(review)
      } else{ res.redirect("/auth/login")}
  })
})
 /*
router.get('/:reviewId/delete', isLoggedIn,(req, res)=> {
  const userId = req.session.currentUser._id
  const reviewId = req.params.reviewId
  Review.findById(reviewId)
  .then((review)=>{
    console.log("useID====>", userId, "review author ====>", review.author.toString(), userId === review.author.toString())  
    if(userId === review.author.toString()){
        User.findByIdAndUpdate(userId, {$pull:{reviews: reviewId}}, {new: true})
        .then((user)=>{
          console.log("user.reviews >>>>>>>>>>>>>>>>>", user.reviews)
          res.redirect(`/reviews/${userId}/user-list`)}) // view palceholder text empy array
         // console.log(review)
      } else{ res.redirect("/auth/login")}
  })
})
*/




  router.route('/:reviewId/edit', isLoggedIn,) 
.get((req, res)=> {
  const userId = req.session.currentUser
  const reviewId = req.params.reviewId
  Review.findById(reviewId)
  .populate("author")
  .populate("game")
  .then((review)=>{
    //  console.log("useID====>", userId.username, "review author ====>", review.author.username)   
    if(userId.username === review.author.username){      
          res.render("../views/reviews/review-edit", review)
         // console.log(review)
      } else{ res.redirect("/auth/login")}
  })
})
.post( fileUploader.single("imageUrl"),(req,res)=>{

  const userId = req.session.currentUser._id
  const reviewId = req.params.reviewId
  const title = req.body.title
  const description = req.body.description
  const videoUrl = req.body.videoUrl
  const imageUrl = req.file && req.file.path
 // console.log("userId:",userId,"reviewId:",reviewId,)
  // if(videoUrl == "")videoUrl = null
  //console.log("pic/////////////////////////////////////////////////////////////", imageUrl)
  Review.findByIdAndUpdate(reviewId, {title, description,imageUrl,videoUrl},{new: true})
  .then((user)=>{
    res.redirect(`/reviews/${userId}/user-list`)
  })
  })


router.route('/:id/user-list', isLoggedIn,) 
.get((req, res)=> {
  const userId = req.session.currentUser
  const routeId = req.params.id
  if(userId._id === routeId){
    var isAuthor = true
  }else { var isAuthor = false}
  User.findById(userId)
  .populate({
    path : 'reviews',
    populate : {
      path : 'game'
    }
  })  
  .then((user)=>{
    //console.log(user.reviews)
    
    res.render("../views/reviews/reviewsList", {user, isAuthor})
    
    
  })
})

router.get("/",  (req, res) => {
  let page = req.query.page
  page = parseInt(page)
  if(page <=0) page=1;
  if(page >= 23) page = 23
  const nextPage = page + 1
  const previousPage = page - 1 
  const limit = 8

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit
  var isNotAuthor = true
if(req.session.currentUser){
  User.findById(req.session.currentUser._id)
  .then((user)=>{
    Review.find()
    .sort({likes: -1})
    .populate("author")
    .populate("game")
    .then((rev)=>{
      var allReviews = rev
      const resultReviewList = allReviews.slice(startIndex,endIndex)
      
      res.render("reviews/reviewsList", { resultReviewList, isNotAuthor, previousPage, nextPage, user});
    })

  })} else{

    Review.find()
    .sort({likes: -1})
    .populate("author")
    .populate("game")
    .then((rev)=>{
      var allReviews = rev
      const resultReviewList = allReviews.slice(startIndex,endIndex)
      
      res.render("reviews/reviewsList", { resultReviewList, isNotAuthor, previousPage, nextPage});
    })
  }
});

module.exports = router;
