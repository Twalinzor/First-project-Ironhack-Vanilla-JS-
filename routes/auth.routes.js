const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const isLoggedOut = require("../middleware/isNotLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");
const saltRounds = 5;

router.post("/signup", isLoggedOut, (req, res) => {
  //GET VALUES
  const { username, email, password } = req.body;
  //VALIDATE
  if (!username || !password || !email) {
    res.render("auth/signup", { errorMessage: "Something went wrong" });
  }
  //Check if user already exists
  User.findOne({ username: username })
    .then((user) => {
      if (user) {
        res.render("auth/signup", { errorMessage: "This user already exists" });
        return;
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        User.create({ username, email, password: hash })
          .then((newUser) => {
            console.log(newUser);
            res.redirect("/auth/login");
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

router.post("/login", isLoggedOut, (req, res) => {
  //GET VALUES
  const { username, password } = req.body;

  console.log("test");

  //VALIDATE
  /*if (!username || !password) {
    res.render("auth/signup", { errorMessage: "Something went wrong" });
  }*/

    User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { errorMessage: "Input invalid" });
      } else {
        const encryptedPassword = user.password;
        const passwordCorrect = bcrypt.compareSync(password, encryptedPassword);

        if (passwordCorrect) {
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("auth/login", { errorMessage: "Input invalid" });
        }
      }
    })
    .catch((err) => console.log(err));
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.render("error", { message: "Something went wrong!" });
    } else {
      res.redirect("/");
    }
  });
});

router.get("/signup", isLoggedOut, (req, res) => {
    res.render("auth/signup");
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

module.exports = router;