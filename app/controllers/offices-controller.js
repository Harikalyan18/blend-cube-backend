const Office = require('../models/office-model')
const { validationResult } = require('express-validator')
const officesCltr = {}

officesCltr.create = async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const { body } = req
        if( req.user.role == 'admin') {
            body.isApproved = true
        }
        else if( req.user.role == 'owner' ) {
            body.status = 'not Available'
        }
         //change the status when all the seats are full to ['occupied']
        // if( approvalStatus == false || all the seats are full logic here we will write )
        body.ownerId = req.user.id
        const office = await Office.create(body)
        res.json(office)
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }
}

officesCltr.update = async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const id = req.params.id
        const body = req.body
        
        const office = await Office.findById(id)

        if(!office) {
            res.status(404).json({ error: 'Office not found' })
        }
        if(req.user.role == 'admin') {
            office.isApproved = true
            office.status = 'available'
            office.save()
            res.json(office)
        }
        if(office.isApproved && req.user.role == 'owner') {
            office.name = body.name
            office.address = body.address
            office.location = body.location
            office.capacity = body.capacity
            office.amenities = body.amenities
            office.save()
            res.json(office)
        } else {
            res.json({ error: 'unauthorised access' })
        }

        // const isAdmin = req.user.role === 'admin'
        // const isOwner = req.user.role === 'owner' //&& office.ownerId === req.user.id

        // // if(isOwner) {
        // //     office.ownerId === req.user._id
        // // } else {
        // //     return res.status(400).json({ error: 'your not allowed to update the office that is not created by you'})
        // // }

        // if (!isAdmin && !isOwner) {
        //     return res.status(400).json({ error: 'Unauthorized to update the office' });
        // }
        // if( !office.isApproved && !isAdmin ) {
        //     return res.status(400).json({ error: 'only admin can change IsApproved' })
        // }
        // if( office.isApproved && !isAdmin && !isOwner ) {
        //     return res.status(400).json({ error: 'only admin and owner can update the office'})
        // }
        // if(isAdmin) {
        //     body.isApproved = true
        //     body.status = 'available'
        // }
        // // if(isOwner) {
        // //     office.ownerId === req.user._id
        // // } else {
        // //     return res.status(400).json({ error: 'your not allowed to update the office that is not created by you'})
        // // }

        // const updatedOffice = await Office.findByIdAndUpdate(id, body, {new: true})
        // res.json(updatedOffice)

    } catch(err) {
        res.status(500).json({ error: err.message})
    }
}

officesCltr.list = async(req, res) => {
    try {
        const office = await Office.find({ isApproved: true })
        res.json(office)
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }
}

officesCltr.disApprovedList = async(req, res) => {
    try {
        const office = await Office.findOne({ isApproved: false })
        res.json(office)
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }
}

officesCltr.remove = async(req, res) => {
    try {
        const id = req.params.id
        const office = await Office.findByIdAndDelete(id)
        res.json(office)
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }
}

module.exports = officesCltr