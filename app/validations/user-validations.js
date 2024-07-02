const User = require('../models/user-model')

const userRegistrationSchema = {
    username: {
        notEmpty: {
            errorMessage: 'username is required'
        },
        trim: true
    },
    email: {
        notEmpty: {
            errorMessage: 'email is required'
        },
        trim: true,
        normalizeEmail: true,
        isEmail: {
            errorMessage: 'valid email is required'
        },
        custom:{ 
            options: async function(value) {
                const user = await User.findOne({email: value})
                if(!user) {
                    return true
                } else {
                    throw new Error('email exists')
                }
            }
        }
    },
    password: {
        notEmpty: {
            errorMessage: 'password is required'
        },
        isLength: {
            options : { min:8, max: 128 },
            errorMessage:'enetr valid password'
        },
        trim: true
    }

}

const userLoginSchema = {
    email: {
        notEmpty: {
            errorMessage: 'email is required'
        },
        trim: true,
        normalizeEmail: true,
        isEmail: {
            errorMessage: 'valid email is required'
        }
    },
    password: {
        notEmpty: {
            errorMessage: 'password is required'
        },
        isLength: {
            options: { min: 8, max: 128},
            errorMessage: 'valid password is required'
        },
        trim: true
    }
}

module.exports = {
    userRegistrationSchema,
    userLoginSchema
}
