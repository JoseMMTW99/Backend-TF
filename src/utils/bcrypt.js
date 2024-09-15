const bcrypt = require('bcrypt');

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Cambia el segundo parámetro para aceptar directamente el hash de la contraseña
const isValidPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

module.exports = {
    createHash,
    isValidPassword
};