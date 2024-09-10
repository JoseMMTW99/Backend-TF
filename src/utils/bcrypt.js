const bcrypt = require('bcrypt')

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // El 10 es el nivel de encriptación (nivel 10 es un termino medio, no usamos mas porque demandaria mas procesador)

// El password es el que se ingresa en el login, y el user es de la base de datos
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

module.exports = {
    createHash,
    isValidPassword
};