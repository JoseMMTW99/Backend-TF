const jwt = require('jsonwebtoken')

const PRIVATE_KEY = 'ClasesB@ckendT0ken'

const generateToken = user => jwt.sign({user}, PRIVATE_KEY, {expiresIn: '24h'})

// Validar que viene por el Header
const authToken = (req, res,next) =>{
    const authHeader = req.headers.authorization
    if(!authHeader) return res.status(401).send({status:'error', error: 'Not Authenticated'})

    const token = authHeader.split('  ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credential) =>{
        if(error) return res.status(401).send({status:'error', error: 'Not Authorized'});
        req.user =  credential.user;
        next()
    })
}

module.exports = {
    PRIVATE_KEY,
    generateToken,
    authToken
};