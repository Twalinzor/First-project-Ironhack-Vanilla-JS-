require("dotenv").config();

var createError = require("http-errors");
var express = require("express");


const indexRoutes= require("./routes/index.routes");
const authRoutes = require("./routes/auth.routes");
const gamesRoutes = require("./routes/games.routes");
const userRoutes = require("./routes/user.routes");
const reviewRoutes = require("./routes/reviews");
const searchRoutes = require("./routes/searchBar.routes")

var app = express();

// Functional curling style of loading configuration
require("./config/db");
require("./config/global")(app);



app.use('/', indexRoutes);
app.use("/auth", authRoutes);
app.use("/games", gamesRoutes);
app.use("/user", userRoutes);
app.use("/reviews", reviewRoutes);
app.use("/search", searchRoutes)



// catch 404 and forward to error handler
/* app.use(function (req, res, next) {
  next(createError(404));
}); */

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;