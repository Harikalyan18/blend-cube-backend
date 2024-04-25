const spacesCltr = {} 
const Space = require('../models/space-model')
const Office = require('../models/office-model')
const Category = require('../models/category-model')

// Create a space
spacesCltr.create = async (req, res) => {
  try {
    // const {name} = req
    // const category = await Category.findOne({ name: name })
    // if (!category) {
    //     return res.status(400).json({ error: 'Category not found' })
    // }
    const officeId = req.params.id
    const office = await Office.findById(officeId)
        if (!office) {
            return res.status(400).json({ error: 'Office not found' })
        }
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
    res.status(201).json(space);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message })
  }
}

// Get a space by ID
spacesCltr.getSpaceById = async (req, res) => {
  try {
    const space = await Space.findById(req.params.spaceId).populate('office');
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    res.json(space);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch space' });
  }
};

// Update a space by ID
spacesCltr.update = async (req, res) => {
  try {
    const space = await Space.findByIdAndUpdate(req.params.spaceId, req.body, { new: true });
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    res.json(space);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update space' });
  }
};

// Delete a space by ID
spacesCltr.remove = async (req, res) => {
  try {
    const space = await Space.findByIdAndDelete(req.params.spaceId);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    res.json({ message: 'Space deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete space' });
  }
};

// List spaces for a specific office
spacesCltr.listSpacesForOffice = async (req, res) => {
    try {
      const { officeId } = req.params;
      const spaces = await Space.find({ officeId }).populate('officeId');
      res.json(spaces);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch spaces for the office' });
    }
  };

  // Search spaces based on criteria
const searchSpaces = async (req, res) => {
    try {
      // Example: search spaces by availability
      const { availability } = req.query;
      const spaces = await Space.find({ isOccupied: availability });
      res.json(spaces);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to search spaces' });
    }
  };

  module.exports = spacesCltr