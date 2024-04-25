const Space = require('../models/space-model')

const spaceValidationSchema = {
    availableQuantity: {
        notEmpty: {
            errorMessage: 'availableQuantity is required'
        }
    },
    spaceType: {
        notEmpty: {
            errorMessage: 'spaceType is required'
        }
    }
}

module.exports = spaceValidationSchema