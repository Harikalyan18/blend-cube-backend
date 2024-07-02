const Booking = require('../models/booking-model')
const Office = require('../models/office-model')
const Space = require('../models/space-model')
const User = require('../models/user-model') // Assuming you have a User model
const { validationResult } = require('express-validator')
const bookingCltr = {}

bookingCltr.create = async (req, res) => {
  // console.log(req)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { space, spaceType, totalAmount, office, duration, currentDaySelection } = req.body

  try {
    // Check if the user exists
    const user = req.user.id
    console.log(user, 'userId')
    const foundUser = await User.findById(user)
    if (!foundUser) {
      return res.status(404).json({ msg: 'User not found' })
    }
    const foundSpace = await Space.findOne({ _id: space })
    // console.log(foundSpace, 'foundSpace')
    if (!foundSpace) {
      return res.status(404).json({ msg: 'Space not found in the specified office' })
    }

    // Check if the space type exists within the space
    const foundSpaceType = foundSpace.type.id(spaceType);
    console.log(foundSpaceType)
    if (!foundSpaceType) {
      return res.status(404).json({ msg: 'Space type not found' })
    }

    // Create a new booking
    const booking = new Booking({
      user: req.user.id,
      space,
      spaceType,
      office,
      currentDaySelection,
      duration,
      totalAmount,
      status: 'pending', // Default status  
    });

    await booking.save()
    res.status(201).json(booking)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}

bookingCltr.getBookingById = async (req, res) => {
  try {
      const bookingId = req.params.id;

      const booking = await Booking.findById(bookingId)
          .populate('user', 'name email') //User model has 'name' and 'email' fields
          .populate({
            path: 'space',
            select: 'name type',
            populate: {
              path: 'type',
              select: 'hour day price _id' // Ensure the fields you need are selected
            }
          })
          .populate('office', 'name address')

      if (!booking) {
          return res.status(404).json({ msg: 'Booking not found' });
      }

    // let displayInfo;
    // if (foundSpaceType.hour) {
    //   displayInfo = `${booking.duration} hours`;
    // } else {
    //   displayInfo = `${foundSpaceType.day} days`;
    // }

      res.json(booking);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
};

module.exports = bookingCltr