const mongoose = require('mongoose')

const { Schema, model } = mongoose
const reviewSchema = new Schema ({
    memberId: {
        type:Schema.Types.ObjectId,
        ref:'Member',
    },
    officeId: {
        type:Schema.Types.ObjectId,
        ref: 'Office', 
    },
    rating: Number,
    comment: String
}, { timestamps: true } )

const Review = model('Review', reviewSchema)

module.exports = Review


// ## Review
// customerId
// propertyId
// rating
// review 
