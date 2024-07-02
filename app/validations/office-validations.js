const Office = require('../models/office-model')

const officeValidationSchema = {
    name : {
        notEmpty: {
            errorMessage: 'name is required'
        }
    },
    'address.locality': {
        notEmpty: {
            errorMessage: 'address is required'
        }
    },
    'address.pincode': {
        notEmpty: {
            errorMessage: 'address is required'
        },
        isNumeric: {
            errorMessage: 'shound be a number'
        }
    },
    'address.city': {
        notEmpty: {
            errorMessage: 'address is required'
        }
    },
    'address.state': {
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