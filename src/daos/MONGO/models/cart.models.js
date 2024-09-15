const mongoose = require('mongoose');

// Definir el esquema para el carrito
const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            price: Number,
            title: String,
            description: String,
            category: String,
            stock: Number
        }
    ]
});

// Crear el modelo para el carrito
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;