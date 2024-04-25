const mongoose = require('mongoose')

const { Schema, model } = mongoose 
const spaceSchema = new Schema({
    office: {
        type: Schema.Types.ObjectId,
        ref: 'Office'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    type:[{
            option: String,
            price: Number
            }],
    availableQuantity: Number,
    rating: Number,
    isAvailable: {
        type: Boolean,
        default: true
    },
    // freeAminities:[{type:Schema.Types.ObjectId,ref:'Amenity'}],
    image:String
    
}, {timestamps: true} )

const Space = model('Space', spaceSchema)

module.exports = Space

// ## space model
//   --officeId:schema.type.ObjectId
//   --categoryId: schema.type.ObjectId
//   --type:[{ name: 'daily', price: '' }{ name: 'monthly', price: '' }]
//   --Available quantity
//   --Availability: {
//      type: boolean
//      default: true
//     }
//   --rating
//   --Free aminities:[aminities ObjectId]
//   --image
