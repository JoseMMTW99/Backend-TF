const passport = require('passport')
const local = require('passport-local')
const { UsersDaoMongo } = require('../daos/MONGO/usersDaoMongo');
const jwt = require('passport-jwt')
const { PRIVATE_KEY } = require('../utils/jsonwebtoken');


const GithubStrategy = require('passport-github2');

const LocalStrategy = local.Strategy
const userService = new UsersDaoMongo();

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
 
const initializatePassport = () => {

    // Función creada para leer las cookies
    const cookieExtractor = (req) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['coderCookieToken']; 
        }
        return token;
    }

    // jwt (con jwt no necesitamos usar session)
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}

module.exports = initializatePassport;