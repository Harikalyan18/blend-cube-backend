const Space = require('../models/space-model')

const spaceValidationSchema = { 
    
    availableQuantity: {
        notEmpty: {
            errorMessage: 'type is required'
        },
        isNumeric: {
            errorMessage: 'price must be number'
        }
    }
}

module.exports = spaceValidationSchema