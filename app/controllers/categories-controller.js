const Category = require('../models/category-model')
const categoriesCltr = {} 

categoriesCltr.create = async(req, res) => {
    try {
        const body = req.body 
        const category = await Category.create(body)
        res.json(category)
    } catch(err) {
        res.status(400).json({ error: 'something went wrong'})
    }
}

categoriesCltr.update = async(req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        const category = await Category.findByIdAndUpdate( id, body, { new: true} )
        res.json(category)
    } catch(err) {
        res.status(400).json({ error: 'something went wrong'})
    }
}

categoriesCltr.remove = async(req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findByIdAndDelete(id)
        res.json(category)
    } catch(err) {
        res.status(400).json({ error: 'something went wrong'})
    }
}

categoriesCltr.list = async(req, res) => {
    try {
        const category = await Category.find()
        res.json(category)
    } catch(err) {
        res.status(400).json({ error: 'something went wrong'})
    }
}

categoriesCltr.category = async(req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findById(id)
        res.json(category)
    } catch {
        res.status(400).json({ error: 'something went wrong'})
    }
}

module.exports = categoriesCltr