const { validationResult } = require('express-validator')
const Member = require('../models/member-model')
const membersCltr = {}

membersCltr.create = async(req, res) => {
    const errors = validationResult(req)
    if(errors.isEmpty()) {
        return res.status(500).json({error: 'something went wrong'})
    }
    try {
    const body = req.body
    const member = await Member.create(body)
    res.status(200).json(member)
    } catch(err) {
        res.status(400).json({err:'internal server error'})
    }
}

membersCltr.update = async(req, res) => {
    const errors = validationResult(req)
    if(errors.isEmpty()) {
        return res.status(500).jason({error: 'something went wrong'})
    }
    try {
        const id = req.params.id
        const body = req.body 
        const member = await Member.findByIdAndUpdate(id, body, {new:true})
        res.json(member)
    } catch(err) {
        res.status(400).json({err:'internal server error'})
    }
}

membersCltr.remove = async(req, res) => {
    try{
        const id = req.params.id
        const member = await Member.findByIdAndDelete(id)
        res.status(200).json(member)
    } catch(err) {
        res.status(400).json({err:'internal server error'})
    }
}

module.exports = membersCltr