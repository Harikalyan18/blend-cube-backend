const { validationResult } = require('express-validator')
const Member = require('../models/member-model')
const _ = require('lodash');
const membersCltr = {}

// 

membersCltr.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ error: errors.array() });
    }
    try {
        const { body, files } = req;
        const userId = req.user.id;

        const existingMember = await Member.findOne({ userId });
        if (existingMember) {
            return res.status(400).json({ error: 'User already has a member profile' });
        }
        if (!files) {
            return res.status(400).json({ error: 'Profile picture is required' });
        }

        const image = req.files['image'] ? req.files['image'][0].path : null;
        const document = req.files['personalDetails[document]'] ? req.files['personalDetails[document]'][0].path : null;

        body.image = image;
        body.personalDetails.document = document;
        body.userId = userId;
        const member = new Member(body);
        await member.save();
        res.status(200).json(member);
    } catch (err) {
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
            const member = await Member.findById(id);
    
            if (!member) {
                return res.status(404).json({ error: 'Member not found' });
            }
    
            // Validate that fullName is not empty
            if (!body.fullName || body.fullName.trim() === '') {
                return res.status(400).json({ error: 'FullName is required' });
            }
            
            // Update only fullName and image fields using lodash
            const updates = _.pick(body, ['fullName', 'image']);
            
            if (file) {
                console.log(file)
                updates.image = file.path
            } else {
                updates.image = member.image; // Keep the old image if no new image is uploaded
            }
            Object.assign(member,updates)
            body.fullName = member.fullName
            const updatedMember = await Member.findOneAndUpdate({_id:id}, member, {new: true})
            
            res.json(updatedMember);
        } catch (err) {
            console.log('update', err);
            res.status(500).json({ error: err.message});
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
        const id = req.params.id
        console.log(id)
        const member = await Member.findOne({ userId:id })
        res.status(200).json(member)
    } catch(err) {
        console.log(err)
        res.status(400).json({err:'internal server error'})
    }
}

module.exports = membersCltr