const spacesCltr = {} 
const Space = require('../models/space-model')
const Office = require('../models/office-model')
const Category = require('../models/category-model')

spacesCltr.create = async (req, res) => {
  try {
    const officeId = req.params.id
    const office = await Office.findById(officeId)
        if (!office) {
            return res.status(400).json({ error: 'Office not found' })
        }
    // const category = await Category.findOne({ name: 'meetimg-room' })
    //   if (!category) {
    //       return res.status(400).json({ error: 'Category not found' })
    //   }
    const { body, file } = req
    body.image = file.path 
    body.office = officeId
    const space = await Space.create(body) //{
        // office: officeId,
        // category: category._id
        // type,
        // availableQuantity,
        // rating, 
        // image
    // })
    res.status(201).json(space)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

spacesCltr.getSpaceById = async (req, res) => {
  try {
    const id = req.params.id
    const space = await Space.findById(id).populate('office')
    if (!space) {
      return res.status(404).json({ error: 'Space not found' })
    }
    res.json(space)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch space' })
  }
}

spacesCltr.update = async (req, res) => {
  try {
    const id = req.params.id
    const {body, file} = req

    body.image = file.path
    const space = await Space.findByIdAndUpdate(id, body, { new: true })
    if (!space) {
      return res.status(404).json({ error: 'Space not found' })
    }
    res.json(space)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update space' })
  }
}

spacesCltr.remove = async (req, res) => {
  try {
    const id = req.params.id
    const space = await Space.findByIdAndDelete(id)
    if (!space) {
      return res.status(404).json({ error: 'Space not found' })
    }
    res.json({ message: 'Space deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete space' })
  }
}

// List spaces for a specific office
spacesCltr.listSpacesForOffice = async (req, res) => {
    try {
      const { officeId } = req.params
      const spaces = await Space.find({ officeId }).populate('officeId')
      res.json(spaces)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch spaces for the office' })
    }
  }

  // Search spaces based on criteria
spacesCltr.searchSpaces = async (req, res) => {
    try {
      // Example: search spaces by availability
      const spaces = await Space.find({ isAvailable: true })
      res.json(spaces)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to search spaces' })
    }
  }

  spacesCltr.list = async (req, res) => {
    try {
      const spaces = await Space.find()
      res.json(spaces)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to search spaces' })
    }
  }

  module.exports = spacesCltr
