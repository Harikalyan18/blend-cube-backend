const mongoose = require('mongoose') 

const{ Schema, model } = mongoose 
const amenitySchema = new Schema({
    name: String
}, {timestamps: true} )

const Amenity = model('Amenity', amenitySchema)

module.exports = Amenity