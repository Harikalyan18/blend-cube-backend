const { validationResult } = require('express-validator')
const Review = require('../models/review-model')
const reviewsCltr = {}

reviewsCltr.create = async(req, res) => {
    const errors = validationResult(req) 
    console.log(errors)
    if(!errors.isEmpty()) {
        return res.status(500).json({error: 'something went wrong'})
    }
    try {
        const {body} = req
        if(body.rating < 1 && body.rating > 5) {
            return res.status(500).json({error: 'review must me greatet than 1 and less than 5'})
         }
        body.memberID = req.user.id
        const review = await Review.create(body)
        res.json(review)   
    }  catch (err) {
        res.status(400).json({ error: err.message });
      }
}

reviewsCltr.update = async(req, res) => {
    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(500).json({error: errors.array()})
    }
    try {
    const { rating, comment } = req.body
    if(rating < 1 || rating > 5) {
        req.status(400).json({error: 'rating must be btwn 1 to 5'})
    }
    const id = req.params.id
    const review = await Review.findByIdAndUpdate(id, { rating, comment }, {new: true})
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

    res.json(review)
    } catch(err) {
        res.status(400).json({ error: err.message });
    }
}

reviewsCltr.remove = async(req, res) => {
    try {
        const id = req.params.id
        const review = await Review.findByIdAndDelete(id)
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        } 
        res.json(review)
    } catch(err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = reviewsCltr