const express = require("express");
const {
  getAllMovies,
  createMovie,
  getParticularMovie,
  updateMovie,
  deleteMovie,
  checkId,
  validateBody,
  getHighestRated,
  getAggregateStat,
  getMovieByGenre,
} = require("../Controller/MoviesController");

const router = express.Router();

// router.param("id", checkId);

router.route('/highestRated').get(getHighestRated, getAllMovies)
router.route('/movies-stats').get(getAggregateStat)
router.route('/movies-genre/:genre').get(getMovieByGenre)

router.route("/").get(getAllMovies).post(createMovie);
router
  .route("/:id")
  .get(getParticularMovie)
  .patch(updateMovie)
  .delete(deleteMovie);

module.exports = router;
