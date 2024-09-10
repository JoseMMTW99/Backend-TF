const dotenv = require('dotenv');
const { connect } = require('mongoose');
const program = require('../utils/commander');
const MongoSingleton = require('../utils/MongoSingleton');

const { mode } = program.opts();
dotenv.config({
    path: mode === 'production' ? './.env.production' : './.env.development'
  });

const objectConfig = {
    port: process.env.PORT || 8080, // Si no usa process.env.PORT, usa el valor 8080
    mongo_url: process.env.MONGO_URL,
    jwt_private_key: process.env.JWT_PRIVATE_KEY ,
    persistence: process.env.PERSISTENCE,
    gmail_user: process.env.GMAIL_USER,
    gmail_pass: process.env.GMAIL_PASS,
    twilio_sid: process.env.TWILIO_ACCOUNT_SID,
    twilio_token: process.env.TWILIO_AUTH_TOKEN,
    twilio_phone: process.env.TWILIO_PHONE
}

const connectDB = async () => {
    MongoSingleton.getInstance()
}

module.exports = {
    objectConfig,
    connectDB
}