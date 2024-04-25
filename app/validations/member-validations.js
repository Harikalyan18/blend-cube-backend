const Member = require('../models/member-model')

const memberValidationSchema = {

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
        'personalDetails.aadharNo': {
            notEmpty: {
                errorMessage:'aadharNo number is required'
            },
            // isLength: {
            //     options: { max:10 }
            // },
            trim: true
        }
 }

module.exports = memberValidationSchema