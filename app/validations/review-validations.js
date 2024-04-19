const Review = require('../models/review-model')

const reviewValidationSchema = {
    rating: {
        notEmpty: {
            errorMessage: 'rating is required'
        }       
    },
    comment: {
        notEmpty: {
            errorMessage: 'comment is required'
        },
        trim: true
    }
}

module.exports = reviewValidationSchema

// const reviewSchema = new Schema ({
//     userId: {
//         type:Schema.Types.userId,
//         ref:'User'
//     },
//     officeId: {
//         type:Schema.Types.officeId,
//         ref: 'Office'
//     },
//     rating: Number,
//     review: String
// })