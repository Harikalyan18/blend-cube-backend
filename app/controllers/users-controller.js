require('dotenv').config()
const User = require('../models/user-model')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const usersCltr = {}

usersCltr.register = async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const { body } = req
        const user = new User(body)
        const salt = await bcrypt.genSalt()
        const encryptedPassword = await bcrypt.hash(user.password, salt)
        user.password = encryptedPassword
        const users = await User.countDocuments()
        if( users == 0 ) {
            user.role = 'admin'
        } else {
            user.role = 'member'
        }
        await user.save()
        res.json(user)
    } catch(err) {
        res.status(400).json({ error: 'something went wrong'})
    }
}

usersCltr.login = async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const {body} = req
        const user = await User.findOne({email: body.email})
        if(!user) {
            res.status(401).json({ error: 'user not found'})
        }
        const checkPassword = await bcrypt.compare(body.password, user.password)
        if(!checkPassword) {
            res.status(400).json({ error: 'invalid email/password'})
        }
        const tokenData= {
            id: user._id,
            role: user.role
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: '7d'}) 
        res.json({ token: token })
    } catch(err) {
        res.status(400).json({err:'Something went wrong'})
    }
}

usersCltr.createOwner = async(req, res) => {
    try {
        const { body } = req
        const user = new User(body)
        const salt = await bcrypt.genSalt()
        const encryptedPassword = await bcrypt.hash(body.password, salt)
        user.password = encryptedPassword
        user.role = 'owner'
        await user.save()
        res.json(user)
    } catch(err) {
        res.status(400).json({err:'Something went wrong'})
    }
}

usersCltr.account = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select({ password: 0})
        console.log(req.user.id)
        res.json(user)
    } catch(err) {
        res.status(400).json({ error: 'something went wrong'})
    }
}

module.exports = usersCltr