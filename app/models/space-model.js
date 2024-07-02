const mongoose = require('mongoose')

const { Schema, model } = mongoose 
const spaceSchema = new Schema({
    name: String,
    office: {
        type: Schema.Types.ObjectId,
        ref: 'Office'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    type:[{  
            day: String,
            hour: String,
            price: {
                type: Number,
                required: true
            }
            }],
    availableQuantity: Number,                    
    rating: Number,
    isAvailable: {
        type: Boolean,
        default: true
    },
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
