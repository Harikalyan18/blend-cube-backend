require('dotenv').config()
const User = require('../models/user-model')
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const usersCltr = {}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
    },
})

usersCltr.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { body } = req
        const user = new User(body)
        const salt = await bcrypt.genSalt()
        const encryptedPassword = await bcrypt.hash(user.password, salt)
        user.password = encryptedPassword;

        const usersCount = await User.countDocuments()
        user.role = usersCount === 0 ? 'admin' : 'member'
        await user.save()

        // Send verification email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: user.email,
            subject: 'Verify your email address',
            html: `<p>Hello ${user.username},</p><p>Click <a href="http://yourwebsite.com/verify?email=${user.email}">here</a> to verify your email address.</p>`,
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending verification email:', error)
                // res.status(500).json({ error: 'Error sending verification email' })
            } else {
                console.log('Verification email sent:', info.response)
                // res.status(200).json({ message: 'Verification email sent successfully' })//
            }
        })
        res.json(user)
    } catch(err) {
        res.status(400).json({ error: 'something went wrong'})
    }
}

// usersCltr.register = async(req, res) => {
//     const errors = validationResult(req)
//     if(!errors.isEmpty()) {
//         return res.status(400).json({errors: errors.array()})
//     }
//     try {
//         const { body } = req
//         const user = new User(body)
//         const salt = await bcrypt.genSalt()
//         const encryptedPassword = await bcrypt.hash(user.password, salt)
//         user.password = encryptedPassword
//         const users = await User.countDocuments()
//         if( users == 0 ) {
//             user.role = 'admin'
//         } else {
//             user.role = 'member'
//         }
//         await user.save()
//         res.json(user)
    // } catch(err) {
    //     res.status(400).json({ error: 'something went wrong'})
    // }

// usersCltr.login = async(req, res) => {
//     const errors = validationResult(req)
//     if(!errors.isEmpty()) {
//         return res.status(400).json({errors: errors.array()})
//     }
//     try {
//         const {body} = req
//         const user = await User.findOne({email: body.email})
//         if(!user) {
//             res.status(401).json({ error: 'user not found'})
//         }
//         const checkPassword = await bcrypt.compare(body.password, user.password)
//         if(!checkPassword) {
//             res.status(400).json({ error: 'invalid email/password'})
//         }
//         const tokenData= {
//             id: user._id,
//             role: user.role
//         }
//         const token = jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: '7d'}) 
//         res.json({ token: token })
//     } catch(err) {
//         res.status(400).json({err:'Something went wrong'})
//     }
// }

// usersCltr.login = async (req, res) => {
//     const errors = validationResult(req)
//     if(!errors.isEmpty()) {
//         return res.status(400).json({errors: errors.array()})
//     }
//     try{
//         const { email, password } = req
//         const user = await User.findOne({ email })
//         if(!user) {
//             res.status(401).json({ error: 'user not found'})
//         }
//         const isPasswordValid = await bcrypt.compare(password, user.password)
//         if(!isPasswordValid) {
//             res.status(400).json({err:'invalid email/password'})
//         }
//         const tokenData = {
//             id:user._id,
//             role:user.role
//         }
//         const token = jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: '7d'})
//         res.json({ token })

//     } catch(err) {
//         res.status(500).json({error: 'internal server error'})
//     }
// }

usersCltr.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: 'user not found' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'invalid email/password' })
        }
        const tokenData = {
            id: user._id,
            role: user.role
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.json({ token })
    } catch(err) {
        res.status(500).json({ error: 'internal server error' })
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
usersCltr.updateRole = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body

        // if (req.user.role !== 'admin') {
        //     return res.status(403).json({ error: 'Only admin can change user roles' })
        // }
        const user = await User.findByIdAndUpdate(id, body, { new: true })
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = usersCltr
