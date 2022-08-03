const Review = require('../models/Review.model');

module.exports.reviewController = {
  postReview: async (req, res) => {
    try {
      const { text } = req.body;
      const reviews = await Review.create({
        text,
        author: req.user.id,
        addressee: req.body.addressee,
      })
      return res.json(reviews)
    } catch (e) {
      return res.json(e.toString())
    }
  },
  patchReview: async (req,res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const review = await Review.findByIdAndUpdate( id, {
        text,
      })
      return res.json(review)
    } catch (error) {
      return res.json(e.toString())
    }
  },
  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
      const review = await Review.findByIdAndRemove(id)
      return res.json("Отзыв удален")
    } catch (e) {
      return res.json(e.toString())
    }
  },
  getReview: async (req, res) => {
    try {
      const review = await Review.find()
      return res.json(review)
    } catch (error) {
      return res,json(e.toString())
    }
  }
}