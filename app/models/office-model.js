const mongoose = require('mongoose')

const { Schema, model } = mongoose
const officeSchema = new Schema({
    name: String,
    image: [{ 
        type: String
     }],
    description: String,
    address: {
        houseNumber: String,
        areaAndStreet: String,
        locality: String,
        pinCode: Number,
        city: String,
        state: String,
        country: String
    },
    location: {    

        type: {
            type: ['Point'],
            required: true
        },
        coordinates: {
            type:[Number], //[latitude, longitude]
            required: true
        }
    },
    capacity: Number,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false,
        required: true
    },
    amenities: [{
        type: String,
        required: true
    }]
}, {timestamps: true} )

const Office = model('Office', officeSchema)

module.exports = Office