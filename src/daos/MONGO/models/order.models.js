const { Schema, model } = require('mongoose');

const OrderSchema = new Schema({
    name: String,
    size: {
        type: String,
        enum: ["small", "medium", "large"], // enum sirve para indicar cuales son las opciones posibles, si ponemos otra da error
        default: "medium",  // Si no le pasamos un valor pone "medium" predeterminadamente
        price: Number,
        quantity: Number,
        date: Date
    }
})


const ordersModel = model('Order', OrderSchema, 'orders'); // Especificando el nombre de la colección como 'orders'

module.exports = { ordersModel };