const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  text: String,
  date: {
    type: Date,
    default: Date.now,
  },
  author: {
    ref: "User",
    type: mongoose.SchemaTypes.ObjectId,
  },
  addressee: {
    ref: "User",
    type: mongoose.SchemaTypes.ObjectId,
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review