const Office = require('../models/office-model')
const _ = require('lodash');
const axios = require('axios')
const { validationResult } = require('express-validator')
const officesCltr = {}


// officesCltr.create = async (req, res) => {
//     try {
//         const { body, files } = req;
//         console.log(body, 'body');
//         console.log(files, 'files');

//         const apiKey = 'ab6864cc24fd4a2faad3d17ca8c7702c';
//         // const address = JSON.parse(body.address) || {};
//         const address = body.address 

//         const { houseNumber, areaAndStreet, locality, city, state, country } = address;
//         if (!houseNumber || !areaAndStreet || !locality || !city || !state || !country) {
//             return res.status(400).json({ error: 'Address fields are required.' });
//         }

//         const addressString = `${houseNumber} ${areaAndStreet}, ${locality}, ${city}, ${state}, ${country}`;
//         const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressString)}&apiKey=${apiKey}`);
//         const { lon, lat } = response.data.features[0].properties;

//         // if (req.user.role === 'admin') {
//         //     body.isApproved = true;
//         //     body.status = 'available';
//         // }
//         // if (req.user.role === 'owner') {
//         //     body.status = 'not Available';
//         // }
//         if (files && files.length > 0) {
//             console.log(files, 'Uploaded files');
//             body.image = files.map(file => file.path);
//         }
//         console.log('files', files);

//         // const office = await Office.create({
//         //     ...body,
//         //     location: {
//         //         type: 'Point',
//         //         coordinates: [lon, lat]
//         //     },
//         //     creator: req.user.id,
//         //     isApproved: req.user.role === 'admin'
//         // });
//         const office = await Office.create({
//             ...body,
//             address: body.address,
//             location: {
//                 type: 'Point',
//                 coordinates: [lon, lat]
//             },
//             status: req.user.role === 'admin' ? 'available' : 'not available',
//             creator: req.user.id,
//             isApproved: req.user.role === 'admin'
//         });
//         res.json(office);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// };


officesCltr.create = async (req, res) => {
    try {
        const { body, files } = req;
        console.log(body, 'body');
        console.log(files, 'files');

        const apiKey = 'ab6864cc24fd4a2faad3d17ca8c7702c';
        // Construct address object from individual fields
        const address = {
            houseNumber: body.houseNumber,
            areaAndStreet: body.areaAndStreet,
            locality: body.locality,
            city: body.city,
            pincode: body.pincode,
            state: body.state,
            country: body.country
        };

        const { houseNumber, areaAndStreet, locality, city, pincode, state, country } = address;
        if (!houseNumber || !areaAndStreet || !locality || !city || !pincode || !state || !country) {
            return res.status(400).json({ error: 'Address fields are required.' });
        }

        const addressString = `${houseNumber} ${areaAndStreet}, ${locality}, ${city},  ${pincode}, ${state}, ${country}`;
        const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressString)}&apiKey=${apiKey}`);
        const { lon, lat } = response.data.features[0].properties;

        // Handle file uploads
        if (files && files.length > 0) {
            console.log(files, 'Uploaded files');
            body.image = files.map(file => `/app/uploads/images/${file.filename}`);
        }

        // Create the office document
        const office = await Office.create({
            ...body,
            address, // Use the constructed address object
            location: {
                type: 'Point',
                coordinates: [lon, lat]
            },
            status: req.user.role === 'admin' ? 'available' : 'not available',
            creator: req.user.id,
            isApproved: req.user.role === 'admin'
        });
        res.json(office);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

officesCltr.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { body, files } = req;
        
        const address = {
            houseNumber: body.houseNumber,
            areaAndStreet: body.areaAndStreet,
            locality: body.locality,
            city: body.city,
            pincode: body.pincode,
            state: body.state,
            country: body.country
        };
        // Find the office by id
        let office = await Office.findById(id);
        if (!office) {
            return res.status(404).json({ error: 'Office not found' });
        }

        // Check if the requester is authorized to update the office
        const isAuthorized = req.user.role === 'admin' || (req.user.role === 'owner' && office.creator.equals(req.user.id) && office.isApproved);
        if (!isAuthorized) {
            return res.status(403).json({ error: 'Unauthorized to update this office' });
        }

        // Construct address object and geocode it if address fields are provided
        const { houseNumber, areaAndStreet, locality, city, pincode, state, country } = address;
        let coordinates = office.location.coordinates; // default to existing coordinates

        if (houseNumber && areaAndStreet && locality && city  && pincode && state && country) {
            const addressString = `${houseNumber} ${areaAndStreet}, ${locality}, ${city},${pincode}, ${state}, ${country}`;
            const apiKey = 'ab6864cc24fd4a2faad3d17ca8c7702c';
            const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressString)}&apiKey=${apiKey}`);
            const { lon, lat } = response.data.features[0].properties;
            coordinates = [lon, lat];
        }

        // Handle file uploads
        if (files && files.length > 0) {
            body.image = files.map(file => file.path);
        } else {
            body.image = office.image; // Keep the old image if no new image is uploaded
        }

        // Update the office object with the new data
        office.set({
            ...body,
            location: {
                type: 'Point',
                coordinates
            }
        });

        // If admin is updating and isApproved is false and status is not available, update to approved and available
        if (req.user.role === 'admin' && !office.isApproved && office.status === 'not Available') {
            office.isApproved = true;
            office.status = 'Available';
        }

        // Save the updated office
        await office.save();
        res.json(office);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


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
      if (req.user.role === 'admin' || (req.user.role === 'owner' && office.creator.equals(req.user.id))) {
        
        await Office.findByIdAndDelete(id);
        res.status(200).json(office)
      } else {
        return res.status(403).json({ error: 'Unauthorized to delete this office' });
      }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete office' });
    }
}

// officesCltr.update = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { body, files } = req

//         let office = await Office.findById(id);

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

//             // const updates = _.pick(body, ['', 'image']);

//             if (files) {
//                 console.log(files, 'Uploaded files');
//                 body.image = files.map(file => file.path);
//             } else {
//                 body.image = office.image; // Keep the old image if no new image is uploaded
//             }
//             Object.assign(office,body)

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
//             } else {
//              Unauthorized to update this office
//              return res.status(403).json({ error: 'Unauthorized to update this office' });
//         }
//             await office.save();
//              res.json(office);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Something went wrong' });
//     }
// };

officesCltr.myOffices = async(req, res) => {
    try {
        const office = await Office.find({ creator: req.user.id })
        if(!office) {
            return res.json({ error: 'office not found' })
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
        } catch (err) {
            console.error(err)
            return res.status(500).json({ error: 'Something went wrong' })
        }
}

module.exports = officesCltr