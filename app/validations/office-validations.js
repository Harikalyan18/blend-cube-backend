const Office = require('../models/office-model')

const officeValidationSchema = {
    name : {
        notEmpty: {
            errorMessage: 'name is required'
        }
    },
    address: {
        notEmpty: {
            errorMessage: 'address is required'
        }
    },
    location: {
        notEmpty: {
            errorMessage: 'location is required'
        }
    },
    capacity: {
        notEmpty: {
            errorMessage: 'capacity is required'
        },
        isNumeric: {
            errorMessage: 'shound be a number'
        }
    },
}
module.exports = officeValidationSchema