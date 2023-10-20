const ApiFeatures = require("../Utils/ApiFeatures");
const MovieModel = require("./../Models/MovieModel");

// PRAM MIDDLEWARE: DON'T NEED CHECKID AS MONGODB ITSELF GIVES AN ERROR
// exports.checkId = (req, res, next, value) => {
//   const selectedMovie = moviesList.find((movie) => {
//     return value == movie.id;
//   });
//   if (!selectedMovie) {
//     return res.status(404).json({
//       status: "Fail",
//       message: `ID: ${value} is not found !`,
//     });
//   }
//   next();
// };

exports.getHighestRated = (req, res, next) => {
  req.query.limit = "2";
  req.query.sort = "-ratings";
  next();
};

// ROUTE HANDLER FUNCTIONS
exports.getAllMovies = async (req, res) => {
  try {
    const features = new ApiFeatures(MovieModel.find(), req.query)
      // .filter()
      .sort()
      .limitingFields()
      .pagination();

    const movies = await features.query;

    res.status(200).json({
      status: "success",
      length: movies.length,
      data: { movies: movies },
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const createMovie = await MovieModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: { movie: createMovie },
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.getParticularMovie = async (req, res) => {
  try {
    const particularMovie = await MovieModel.find({ _id: req.params.id });
    res.status(200).json({
      status: "success",
      data: { movie: particularMovie },
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await MovieModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: { movie },
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    await MovieModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.getAggregateStat = async (req, res) => {
  try {
    const stats = await MovieModel.aggregate([
      // { $match: { ratings: { $gt: 4.5 } } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$ratings" },
          avgDuration: { $avg: "$duration" },
          minDuration: { $min: "$duration" },
          maxDuration: { $max: "$duration" },
          totalDuration: { $sum: "$duration" },
          movieCount: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      length: stats.length,
      data: { stats },
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.getMovieByGenre = async (req, res) => {
  try {
    const genre = req.params.genre;
    const movies = await MovieModel.aggregate([
      { $unwind: "$genres" },
      {
        $group: {
          _id: "$genres",
          movieCount: { $sum: 1 },
          movies: { $push: "$name" },
        },
      },
      { $addFields: { genre: "$_id" } },
      {$project: {_id: 0}},
      {$sort: {movieCount: -1}},
      {$match: {genre: genre}}
    ]);
    res.status(200).json({
      status: "success",
      length: movies.length,
      data: { movies },
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
};
