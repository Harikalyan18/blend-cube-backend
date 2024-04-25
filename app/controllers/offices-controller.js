const Office = require('../models/office-model')
const _ = require('lodash');
const axios = require('axios')
const { validationResult } = require('express-validator')
const officesCltr = {}


// officesCltr.create = async(req, res) => {
//     const errors = validationResult(req)
//     if(!errors.isEmpty()) {
//         return res.status(400).json({errors: errors.array()})
//     }
//     try {
//         const { body } = req
//         if( req.user.role == 'admin') {
//             body.isApproved = true
//         }
//         else if( req.user.role == 'owner' ) {
//             body.status = 'not Available'
//         }
//         //  //change the status ['occupied'] when all the spaces are booked 

//         body.ownerId = req.user.id
//         const office = await Office.create(body)
//         res.json(office)
//     } catch(err) {
//         res.status(500).json({ error: 'something went wrong'})
//     }
// }

officesCltr.create = async (req, res) => {
    try {
        const { body } = req;
  
        const apiKey = 'ab6864cc24fd4a2faad3d17ca8c7702c';
        const { houseNumber, areaAndStreet, locality, city, state, country } = body.address
        const addressString = `${houseNumber} ${areaAndStreet}, ${locality}, ${city}, ${state}, ${country}`
        // Geocode the provided address using Geoapify API
        const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressString)}&apiKey=${apiKey}`)
        const { lon, lat } = response.data.features[0].properties

        if(req.user.role == 'admin') {
            body.isApproved = true
            body.status = 'available'
        }
        if( req.user.role == 'owner' ) {
            body.status = 'not Available'
        }

        // Construct office object with geocoded location
        const office = await Office.create({
            ...body,
            location: {
                type: 'Point',
                coordinates: [lon, lat]
            },
            creator: req.user.id,
            isApproved: req.user.role === 'admin'
        })
        res.json(office)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
}

// officesCltr.update = async(req, res) => {
//     const errors = validationResult(req)
//     if(!errors.isEmpty()) {
//         return res.status(400).json({errors: errors.array()})
//     }
//     // try {

//     //     // if(!office.isApproved && req.user.role == 'admin') {
//     //     //     office.isApproved = true
//     //     //     office.status = 'available'
//     //     // }

//     // } catch(err) {
//     //     res.status(500).json({ error: err.message})
//     // }

//     try {
//         // Extract the office ID from the request parameters
//         const { id } = req.params;

//         // Find the office by ID
//         let office = await Office.findById(id);

//         // If the office is not found, return a 404 error
//         if (!office) {
//             return res.status(404).json({ error: 'Office not found' });
//         }

//         // Check if the requester is authorized to update the office
//         if (req.user.role === 'admin' || (req.user.role === 'owner' && office.creator.equals(req.user.id) && office.isApproved)) {
//             // Extract the address fields from the request body
//             const { houseNumber, areaAndStreet, locality, city, state, country } = req.body.address;

//             // Construct the address string
//             const addressString = `${houseNumber} ${areaAndStreet}, ${locality}, ${city}, ${state}, ${country}`;

//             // Geocode the provided address using Geoapify API
//             const apiKey = 'ab6864cc24fd4a2faad3d17ca8c7702c';
//             const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressString)}&apiKey=${apiKey}`);
//             const { lon, lat } = response.data.features[0].properties;

//             // Update the office object with the new data
//             office = await Office.findByIdAndUpdate(id, {
//                 ...req.body,
//                 location: {
//                     type: 'Point',
//                     coordinates: [lon, lat]
//                 }
//             }, { new: true });

//             // If admin is updating and isApproved is false and status is not available, update to approved and available
//             if (req.user.role === 'admin' && !office.isApproved && office.status === 'not Available') {
//                 office.isApproved = true;
//                 office.status = 'Available';
//                 await office.save();
//             }

//             // Return the updated office object
//             return res.json(office);
//         } else {
//             // Unauthorized to update this office
//             return res.status(403).json({ error: 'Unauthorized to update this office' });
//         }
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Something went wrong' });
//     }
// }

officesCltr.list = async(req, res) => {
    try {
        const office = await Office.find({ isApproved: true })
        res.json(office)
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }
}

officesCltr.disApprovedList = async(req, res) => {
    try {
        const office = await Office.find({ isApproved: false })
        res.json(office)
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }
}

officesCltr.remove = async(req, res) => {

    const { id } = req.params

    try {
      const office = await Office.findById(id)
  
      if (!office) {
        return res.status(404).json({ error: 'Office not found' })
      }
      // Check if the requester is authorized to delete the office
      if (req.user.role === 'admin' || (req.user.role === 'owner' && office.creator.equals(req.user.id))) {
        
        await Office.findByIdAndDelete(id);
        res.json(office)
        // res.status(200).json({ message: 'Office deleted successfully' });
      } else {
        res.status(403).json({ error: 'Unauthorized to delete this office' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete office' });
    }
}

officesCltr.update = async (req, res) => {
    try {
        const { id } = req.params;

        let office = await Office.findById(id);

        if (!office) {
            return res.status(404).json({ error: 'Office not found' });
        }

        // Check if the requester is authorized to update the office
        if (req.user.role === 'admin' || (req.user.role === 'owner' && office.creator.equals(req.user.id) && office.isApproved)) {
            // Extract the address fields from the request body
            const { houseNumber, areaAndStreet, locality, city, state, country } = req.body.address;

            // Construct the address string
            const addressString = `${houseNumber} ${areaAndStreet}, ${locality}, ${city}, ${state}, ${country}`;

            // Geocode the provided address using Geoapify API
            const apiKey = 'ab6864cc24fd4a2faad3d17ca8c7702c';
            const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressString)}&apiKey=${apiKey}`);
            const { lon, lat } = response.data.features[0].properties;

            // Update the office object with the new data
            office = await Office.findByIdAndUpdate(id, {
                ...req.body,
                location: {
                    type: 'Point',
                    coordinates: [lon, lat]
                }
            }, { new: true });
            // await office.save();
            // If admin is updating and isApproved is false and status is not available, update to approved and available
            if (req.user.role === 'admin' && !office.isApproved && office.status === 'not Available') {
                office.isApproved = true;
                office.status = 'Available';
            }
            await office.save();
            return res.json(office);
        } else {
            // Unauthorized to update this office
            return res.status(403).json({ error: 'Unauthorized to update this office' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

officesCltr.myOffices = async(req, res) => {
    try {
        const office = await Office.find({ creator: req.user.id })
        if(!office) {
            res.json({ error: 'office not found' })
        }
        res.json(office)
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }

}

officesCltr.office = async(req, res) => {
        try {
            const id = req.params.id;
    
            // Define the query based on user role
            let query = { _id: id };
            if (req.user.role === 'owner') {
                query.creator = req.user.id;
            }
            const office = await Office.findOne(query);

            if (!office) {
                return res.status(404).json({ error: 'Office not found' });
            }
            return res.json(office);
    // const id = req.params.id

    //     let office
       
    //     if (req.user.role === 'admin') {
    //         office = await Office.findById(id);
    //     } else if (req.user.role === 'owner') {
    //         office = await Office.findOne({ _id: id, creator: req.user.id })
    //     }     
    //     if (!office) {
    //         return res.status(404).json({ error: 'Office not found' })
    //     }
    //     res.json(office)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

module.exports = officesCltr