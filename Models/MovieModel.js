const mongoose = require("mongoose");

// CREATED SCHEMA
const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required field!"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required field!"],
    },
    ratings: {
      type: Number,
      default: 1.0,
    },
    totalRatings: {
      type: Number,
    },
    releaseYear: {
      type: Number,
      required: [true, "ReleaseYear is required!"],
    },
    releaseDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    genres: {
      type: [String],
      required: [true, "Genres is required!"],
    },
    directors: {
      type: [String],
      required: [true, "Directors is required"],
    },
    coverImage: {
      type: String,
      required: [true, "cover image is required"],
    },
    casts: {
      type: [String],
      required: [true, "Casts is required"],
    },
    username: {
      type: String
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.pre('save',function(next) {
  this.username = 'Isha Agrawal'
  next();
})

movieSchema.post('save', (doc, next) => {
  const content = `A new movie document with name ${doc.name} has been created by ${doc.username}`
  console.log(content)
  next()
})

movieSchema.pre('find' ,function(next) {
  this.find({releaseDate: {$lte: Date.now()}})
  next()
})

movieSchema.virtual("durationInHour").get(function () {
  return this.duration / 60;
});



// CREATED MODEL
const MovieModel = mongoose.model("Movie", movieSchema);

module.exports = MovieModel;
