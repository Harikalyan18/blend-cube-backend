const { validationResult } = require('express-validator')
const Member = require('../models/member-model')
const membersCltr = {}

// membersCltr.create = async(req, res) => {
//     const errors = validationResult(req)
//     if(!errors.isEmpty()) {
//         return res.status(500).json({error: 'something went wrong'})
//     }
//     try {
//     const { body, file } = req
//     if (!file) {
//         return res.status(400).json({ error: 'Profile picture is required' })
//     }
//     console.log(body)
//     console.log(file)
    
//     // Add profile picture path to body
//     body.image = file.path
//     body.userId = req.user.id
//     const member = new Member(body)
//     // member.userId = req.user.id
//     // const member = await Member.create(body)
//     res.status(200).json(member)
//     } catch(err) {
//         res.status(400).json({err: err.message })
//     }
// }

membersCltr.create = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ error: errors.array() });
    }
    try {
        const { body, file } = req;
        if (!file) {
            return res.status(400).json({ error: 'Profile picture is required' });
        }
        console.log(body);
        console.log(file);
        
        // Add profile picture path to body
        body.image = file.path;
        body.userId = req.user.id;
        const member = new Member(body);
        // member.userId = req.user.id
        // const member = await Member.create(body)
        member.save()
        res.status(200).json(member);
    } catch(err) {
        res.status(400).json({ err: err.message });
    }
};

membersCltr.update = async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() })
    }
    try {
        const id = req.params.id
        const { body, file } = req
        body.image = file.path;
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

membersCltr.list = async(req, res) => {
    try{
        const member = await Member.find()
        res.status(200).json(member)
    } catch(err) {
        res.status(400).json({err:'internal server error'})
    }
}

membersCltr.member = async(req, res) => {
    try{
        const id = req. params.id
        const member = await Member.findById(id)
        res.status(200).json(member)
    } catch(err) {
        res.status(400).json({err:'internal server error'})
    }
}

module.exports = membersCltr