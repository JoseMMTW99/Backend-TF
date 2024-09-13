const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userCollection = 'usuarios';

// Esquema para un producto en el carrito
const productSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product' // Asume que tienes un modelo de Producto
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
});

// Esquema de usuario
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        index: true
    },
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    role: {
        type: String,
        default: 'user'
    },
    cart: {
        type: {
            products: [productSchema] // Usa el esquema del producto para el carrito
        },
        default: { products: [] } // Valor por defecto para el carrito
    }
});

UserSchema.plugin(mongoosePaginate);

const userModel = model(userCollection, UserSchema);

module.exports = { userModel };