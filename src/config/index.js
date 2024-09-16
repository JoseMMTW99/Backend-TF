const path = require('path');
const dotenv = require('dotenv');
const program = require('../utils/commander');
const MongoSingleton = require('../utils/MongoSingleton');

const { mode } = program.opts();
console.log('Mode:', mode);  // Debugging line to check the value of mode

// Cargar el archivo .env por defecto
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Cargar el archivo de entorno específico si se ha especificado un modo
if (mode) {
    const envFilePath = path.resolve(__dirname, `../.env.${mode}`);
    console.log('Loading env file:', envFilePath);  // Debugging line to check the file path
    dotenv.config({ path: envFilePath });
}

const objectConfig = {
    port: process.env.PORT || 8080,
    mongo_url: process.env.MONGO_URL,
    jwt_private_key: process.env.JWT_PRIVATE_KEY,
    persistence: process.env.PERSISTENCE,
    gmail_user: process.env.GMAIL_USER,
    gmail_pass: process.env.GMAIL_PASS,
    twilio_sid: process.env.TWILIO_ACCOUNT_SID,
    twilio_token: process.env.TWILIO_AUTH_TOKEN,
    twilio_phone: process.env.TWILIO_PHONE,
    stripe_key: process.env.STRIPE_KEY,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY
};

console.log('Port:', objectConfig.port);  // Debugging line to check the loaded port

const connectDB = async () => {
    await MongoSingleton.getInstance();
};

module.exports = {
    objectConfig,
    connectDB
};