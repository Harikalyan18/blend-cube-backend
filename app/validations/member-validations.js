const Member = require('../models/member-model')

const memberValidationSchema = {
    image: {
        notEmpty: {
            errorMessage: 'image is required'
        }
    },
        'personalDetails.fullName': {
            notEmpty: {
                errorMessage:'full name is required'
            },
            trim: true
        },
        'personalDetails.fullAddress': {
            notEmpty: {
                errorMessage:'full address is required'
            }
        },
        'personalDetails.occupation': {
            notEmpty: {
                errorMessage:'occupation is required'
            }
        },
        'personalDetails.purpose': {
            notEmpty: {
                errorMessage:'purpose is required'
            }
        },
        'personalDetails.pancard': {
            notEmpty: {
                errorMessage:'pancard number is required'
            },
            isLength: {
                options: { min: 10, max:10 }
            },
            trim: true
        },
        'personalDetails.bankAccount': {
            notEmpty: {
                errorMessage:'bank account number is required'
            },
            isLength: {
                options: { min: 11 }
            },
            isNumeric: {
                errorMessage:'Numbers only'
            },
            trim: true
        }   
 }

module.exports = memberValidationSchema