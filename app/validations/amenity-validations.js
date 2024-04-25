const Amenity = require('../models/amenity-model')

const amenityValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: 'name is required'
        }
    }
}

module.exports = amenityValidationSchema