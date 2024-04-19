const mongoose = require('mongoose')

const { Schema, model } = mongoose
const memberSchema = new Schema ({
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     ref:'User'
    // },
    image: String,
    personalDetails: {
        fullName: String,
        fullAddress: String,
        occupation: String,
        purpose: String,
        pancard: String,
        bankAccount: String,
        documentNo: String
    },
    bookingHistory: {
        type:[Schema.Types.ObjectId],
        ref:'Booking'
    },
    preferences: {
        type: [Schema.Types.ObjectId],
        ref: 'Space'
    }
}, { timestamps: true })

const Member = model('Member', memberSchema)

module.exports = Member

// ## Member Details:
// -- user Id
// -- Image
// -- Personal details:{fullname:"",
//                      full Address:"",
//                      occupation:"",
//                      purpose:"",
//                      PAN card:"",
//                      One Bank Account No:"",
//                      Document No:""}
// -- Booking History:[Booking Id]
// -- Preferences:[spaceId]