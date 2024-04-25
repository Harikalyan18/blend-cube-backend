const Amenity = require("../models/amenity-model")
amenitiesCltr = {}

amenitiesCltr.create = async(req, res) => {
    try {
        const body = req.body
        const amenity = await Amenity.create(body)
        res.json(amenity)
    } catch(err) {
        res.status(400).json({ error: 'something went wrong'})
    }
}

amenitiesCltr.update = async(req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        const amenity = await Amenity.findByIdAndUpdate( id, body, { new: true} )
        res.json(amenity)
    } catch(err) {
        res.status(400).json({ error: 'something went wrong'})
    }
}

amenitiesCltr.remove = async(req, res) => {
    try {
        const id = req.params.id
        const category = await Amenity.findByIdAndDelete(id)
        res.json(category)
    } catch(err) {
        res.status(400).json({ error: 'something went wrong'})
    }
}

amenitiesCltr.list = async(req, res) => {
    try {
        const amenity = await Amenity.find()
        res.json(amenity)
    } catch(err) {
        res.status(400).json({ error: 'something went wrong'})
    }
}

amenitiesCltr.amenity = async(req, res) => {
    try {
        const id = req.params.id
        const amenity = await Amenity.findById(id)
        res.json(amenity)
    } catch {
        res.status(400).json({ error: 'something went wrong'})
    }
}

module.exports = amenitiesCltr