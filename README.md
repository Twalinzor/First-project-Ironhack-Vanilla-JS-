# CtrlVgods

Review, comment and Play!

## Description

CtrlVgods is a project that was born from the passion of four young developers about coding and gaming. This web app is a "social gaming network" where we display a list of more than 500 free to play games for our users to interact, review and coment about their playing experiences. 
 
## User Stories

## Backlog

List of other features outside of the MVPs scope

User profile:

- see other users profile
- list of reviews created by the user
- favorite games
-

CRUD:

- User can create and display new games


## ROUTES:

(AUTH )- ROUTES

- GET "/"
  - renders the homepage

- GET "/auth/signup"
  - redirects to "/" if user logged in
  - renders the signup form (with flash msg)

- POST "/auth/signup"
  - redirects to "/ "if user logged in
  - body:
    - username
    - email
    - password

- GET "/auth/login"
  - redirects to "/" if user logged in
  - renders the login form (with flash msg)

- POST "/auth/login"
  - redirects to "/"if user logged in
  - body:
    - username
    - password

- POST "/auth/logout"
    - redirects to "/" if user logged in     
    - body: (empty)

(USER) - ROUTES

- POST "/user/reviews/:id/delete-review"
    - If isAuthor delete the review
    - redirect to "/user/reviews"

    
- GET "/user/reviews/:id/edit"
    - Render edit of the review

- POST "/user/reviews/:id/edit"
    - body:
        - Description
        - ImgUrl
    - redirect "/user/reviews"


- GET "/user/reviews/"
    - Render all the reviews that user made
    
    

- POST "/user/coments/:id/delete-comment
    - If isAuthor delete the comment

- GET "/user/comments/:id/edit"
    - Render edit of the comment

- POST "/user/comments/:id/edit"
    - body:
        - Description
    - redirect "/user/comments"

- GET"/user/comments/"
    - Render all posts made



- GET "/user/profile"  
    - redirects to "/profile" if user logged in
    - display:
        - user information
        - reviews done
        - coments done

(GAMES) - ROUTES

- GET "/games"
  - renders random games
  - render form of genres

- POST "/games"
    - render by genre

- GET "/games/:id/details"
  - render the details of the choosen game
  - includes the list of  the preview  of the reviews of the game
    - reviews
    - comments
  
- GET "/games/:id/create-review"
    - render the form to create a review

- POST "/games/:id/create-review"
    - body: 
        - description
        - imgUrl
    - res.redirect "/review/:id/details"


(REVIEW) - ROUTES

 - GET "/reviews"
    - render all the reviews

- GET "/reviews/:id/details"
    - Render the information of the review
    - Render Comment Form

- POST "/reviews/:id/details"
    - body:
        - comment
    - res.redirect "/reviews/:id/details"


## Models


User model
``` 

username: String
email: String
password: String
reviews: [{type objectid model Review}]
comments: [{type objectid model Comment}]

```

Game model

```
apiId: String
reviews: [{type objectid model Review}]

```

Review model
 
```
author: {type objectid model User}
comments: [{type objectid model Comment}]
likes: [{User}]
title: String
description: String
imageUrl: String
videoUrl: String

```

Comment model

```
author: {type objectid model User}
text: String

```

## Links

### Trello

[Link to your trello board](https://trello.com) or picture of your physical board

### Git

The url to your repository and to your deployed project

[Repository Link](http://github.com)

[Deploy Link](http://heroku.com)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)
