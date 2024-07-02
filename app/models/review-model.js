const mongoose = require('mongoose')

const { Schema, model } = mongoose
const reviewSchema = new Schema ({
    member: {
        type:Schema.Types.ObjectId,
        ref:'Member',
    },
    office: {
        type:Schema.Types.ObjectId,
        ref: 'Office', 
    },
    rating: Number,
    review: String
}, { timestamps: true } )

const Review = model('Review', reviewSchema)

module.exports = Review


// ## Review
// customerId
// propertyId
// rating
// review 
