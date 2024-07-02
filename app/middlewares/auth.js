const jwt = require('jsonwebtoken')

// const authenticateUser = async(req, res, next) => {
//     const token = req.headers['authorization']
//     if(!token) {
//         res.status(401).json({ error: 'token is required'})
//     }
//     try {
//         const tokenData = await jwt.verify(token, process.env.JWT_SECRET)
//             req.user = {
//                 id:tokenData.id,
//                 role:tokenData.role
//             }
//             next()
//     } catch(err) {
//         res.status(400).json({error: err.message})
//     }
// }

const authenticateUser = async (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ error: 'token is required' });
    }

    try {
        const tokenData = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: tokenData.id,
            role: tokenData.role
        };
        next();
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};


const authoriseUser = (permittedRoles) => {
    return(req, res, next) => {
        if(req.user && permittedRoles.includes(req.user.role)) {
            next()
        } else {
            res.status(403).json({ error: 'access denied'})
        }
    }
}

module.exports = {
    authenticateUser,
    authoriseUser
}