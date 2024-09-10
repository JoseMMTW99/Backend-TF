const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const userCollection = 'usuarios'

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        index: true // Esto es para indexar (para mejorar la velocidad de búsqueda en el array de usuarios)
    },
    last_name: String,
    email: {
        type: String,
        required: true, // Campo obligatorio
        unique: true // No se puede repetir el campo
    },
    password: String,
    role: {
        type: String,
        default: 'user'
    }
})

UserSchema.plugin(mongoosePaginate)

const userModel = model(userCollection, UserSchema);

module.exports = { userModel };