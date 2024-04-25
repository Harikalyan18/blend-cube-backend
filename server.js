const { checkSchema } = require('express-validator')
const multer = require("multer");
const express = require('express')
const cors = require('cors')
const app = express()
port = 3010

app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({ extended: true }));

const configureDB = require('./config/db')
configureDB()

//Define storage for the uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images') // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // File name format: timestamp-originalname
    }
});
//Initialize Multer instance
const upload = multer({ storage: storage });

const membersCltr = require('./app/controllers/members-controller')
const memberValidationSchema = require('./app/validations/member-validations')

const reviewsCltr = require('./app/controllers/reviews-controller')
const reviewValidationSchema = require('./app/validations/review-validations')

const usersCltr = require('./app/controllers/users-controller')
const { userRegistrationSchema, userLoginSchema } = require('./app/validations/user-validations')
const  { authenticateUser, authoriseUser } = require('./app/middlewares/auth')

const officesCltr = require('./app/controllers/offices-controller')
const officeValidationSchema = require('./app/validations/office-validations')

const categoriesCltr = require('./app/controllers/categories-controller')
const categoryValidationSchema = require('./app/validations/category-validations')

const spacesCltr = require('./app/controllers/spaces-controller')
const spaceValidationSchema = require('./app/validations/space-validations')

const amenitiesCltr = require('./app/controllers/ametities-controller');
const amenityValidationSchema = require('./app/validations/amenity-validations');

//categoties
app.post('/api/categories', authenticateUser, authoriseUser(['admin']), checkSchema(categoryValidationSchema), categoriesCltr.create)
app.put('/api/categories/:id', authenticateUser, authoriseUser(['admin']), checkSchema(categoryValidationSchema), categoriesCltr.update)
app.delete('/api/categories/:id', authenticateUser, authoriseUser(['admin']), categoriesCltr.remove)
app.get('/api/categories', categoriesCltr.list)
app.get('/api/categories/:id', categoriesCltr.category)

//amenities
app.post('/api/amenities', authenticateUser, authoriseUser(['admin', 'owner']), checkSchema(amenityValidationSchema), amenitiesCltr.create)
app.put('/api/amenities/:id', authenticateUser, authoriseUser(['admin', 'owner']), checkSchema(amenityValidationSchema), amenitiesCltr.update)
app.delete('/api/amenities/:id', authenticateUser, authoriseUser(['admin', 'owner']), amenitiesCltr.remove)
app.get('/api/amenities', amenitiesCltr.list)
app.get('/api/amenities/:id', amenitiesCltr.amenity)

//members
app.post('/api/members', authenticateUser, authoriseUser(['member']), upload.single('image'), checkSchema(memberValidationSchema), membersCltr.create)
app.put('/api/members/:id', authenticateUser, authoriseUser(['member']), upload.single('image'), checkSchema(memberValidationSchema), membersCltr.update)
app.delete('/api/members/:id', authenticateUser, authoriseUser(['member', 'admin']), membersCltr.remove)
app.get('/api/members', authenticateUser, authoriseUser(['admin']), membersCltr.list)
app.get('/api/members/:id', authenticateUser, authoriseUser(['member', 'admin']), membersCltr.member)

//reviews
app.post('/api/reviews', authenticateUser, authoriseUser(['member']), checkSchema(reviewValidationSchema), reviewsCltr.create)
app.put('/api/reviews/:id', authenticateUser, authoriseUser(['member']),checkSchema(reviewValidationSchema), reviewsCltr.update)
app.delete('/api/reviews/:id',  authenticateUser, authoriseUser(['member']), reviewsCltr.remove)

//users
app.post('/api/users/register', checkSchema(userRegistrationSchema), usersCltr.register)
app.post('/api/users/login', checkSchema(userLoginSchema), usersCltr.login)
app.post('/api/users/create-owner', authenticateUser, authoriseUser(['admin']), usersCltr.createOwner)
app.get('/api/users/account', authenticateUser, usersCltr.account)
app.put('/api/users/changeRole/:id', authenticateUser, authoriseUser(['admin']), checkSchema(userRegistrationSchema), usersCltr.updateRole)

//offices
app.post('/api/offices/create', authenticateUser, authoriseUser(['admin', 'owner']), checkSchema(officeValidationSchema), officesCltr.create)
app.put('/api/offices/update/:id', authenticateUser, authoriseUser(['admin', 'owner']), checkSchema(officeValidationSchema), officesCltr.update)
app.get('/api/offices', officesCltr.list)
app.get('/api/offices/disapproved', authenticateUser, authoriseUser(['admin']), officesCltr.disApprovedList)
app.get('/api/offices/my', authenticateUser, authoriseUser(['admin', 'owner']), officesCltr.myOffices)
app.get('/api/offices/:id', authenticateUser, authoriseUser(['admin', 'owner']), officesCltr.office)
app.delete('/api/offices/:id', authenticateUser, authoriseUser(['admin', 'owner']), officesCltr.remove)

//spaces
app.post('/api/spaces/:id', authenticateUser, authoriseUser(['admin', 'owner']), upload.single('image'), checkSchema(spaceValidationSchema), spacesCltr.create)
app.put('/api/spaces/:id', authenticateUser, authoriseUser(['owner', 'admin']), upload.single('image'), checkSchema(spaceValidationSchema), spacesCltr.update)
app.delete('/api/spaces/:id', authenticateUser, authoriseUser(['owner', 'admin']), checkSchema(spaceValidationSchema), spacesCltr.remove)
app.get('/api/spaces/:id', spacesCltr.listSpacesForOffice)
app.get('/api/spaces/:id', spacesCltr.getSpaceById)
app.get('/api/spaces/available', spacesCltr.searchSpaces)
app.get('/api/spaces', spacesCltr.list)


app.listen(port, () => {
    console.log('server is running on port '+port)
})