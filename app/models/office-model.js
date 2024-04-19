const mongoose = require('mongoose')

const { Schema, model } = mongoose
const officeSchema = new Schema({
    name: String,
    address: String,
    location: String,
    capacity: Number,
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: 'available',
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false,
        required: true
    },
    amenities: [{
        type: String
    }]
})

const Office = model('Office', officeSchema)

module.exports = Office