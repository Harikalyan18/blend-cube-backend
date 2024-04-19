const { checkSchema } = require('express-validator')
const express = require('express')
const cors = require('cors')
const app = express()
port = 3010

app.use(cors())
app.use(express.json())

const configureDB = require('./config/db')
configureDB()

const membersCltr = require('./app/controllers/members-controller')
const memberValidationSchema = require('./app/validations/member-validations')

const reviewsCltr = require('./app/controllers/reviews-controller')
const reviewValidationSchema = require('./app/validations/review-validations')

const usersCltr = require('./app/controllers/users-controller')
const { userRegistrationSchema, userLoginSchema } = require('./app/validations/user-validations')
const  { authenticateUser, authoriseUser } = require('./app/middlewares/auth')

const officesCltr = require('./app/controllers/offices-controller')
const officeValidationSchema = require('./app/validations/office-validations')

app.post('/api/members', checkSchema(memberValidationSchema), membersCltr.create)
app.put('/api/members/:id', checkSchema(memberValidationSchema), membersCltr.update)
app.delete('/api/members/:id', membersCltr.remove)

app.post('/api/reviews', checkSchema(reviewValidationSchema), reviewsCltr.create)
app.put('/api/reviews/:id', checkSchema(reviewValidationSchema), reviewsCltr.update)
app.delete('/api/reviews/:id', reviewsCltr.remove)

app.post('/api/users/register', checkSchema(userRegistrationSchema), usersCltr.register)
app.post('/api/users/login', checkSchema(userLoginSchema), usersCltr.login)
app.post('/api/users/create-owner', authenticateUser, authoriseUser(['admin']), usersCltr.createOwner)
app.get('/api/users/account', authenticateUser, usersCltr.account)

app.post('/api/offices/create', authenticateUser, authoriseUser(['admin', 'owner']), checkSchema(officeValidationSchema), officesCltr.create)
app.put('/api/offices/update/:id', authenticateUser, authoriseUser(['admin', 'owner']), checkSchema(officeValidationSchema), officesCltr.update)

app.listen(port, () => {
    console.log('server is running on port '+port)
})