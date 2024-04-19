const jwt = require('jsonwebtoken')

const authenticateUser = async(req, res, next) => {
    const token = req.headers['authorization']
    try {
        if(!token) {
            res.status(401).json({ error: 'token is required'})
        }
        const tokenData = await jwt.verify(token, process.env.JWT_SECRET)
            req.user = {
                id:tokenData.id,
                role:tokenData.role
            }
            next()
    } catch(err) {
        res.status(400).json({error: err.message})
    }
}

const authoriseUser = (permittedRoles) => {
    return(req, res, next) => {
        if(permittedRoles.includes(req.user.role)) {
            next()
        } else {
            res.status(400).json({ error: 'access denied'})
        }
    }
}

module.exports = {
    authenticateUser,
    authoriseUser
}