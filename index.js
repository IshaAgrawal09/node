const express = require("express");
const movieRouter = require('./Route/MoviesRouter')
const app = express();

const logger = function (req, res, next) {
  req.requestedAt = new Date().toISOString();
  next();
};
app.use(express.json());
app.use(logger);

app.use("/api/movies", movieRouter);
app.all('*',(req,res,next) => {
  res.status(404).json({
    status: 'Fail',
    message: `Can't find ${req.originalUrl} on the server`
  })
})

module.exports = app