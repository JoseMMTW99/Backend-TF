const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productCollection = 'products';

// Esquema para el producto
const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true // Indexar para mejorar la velocidad de búsqueda
    },
    description: {
        type: String,
        default: '' // Valor por defecto si no se proporciona descripción
    },
    price: {
        type: Number,
        required: true // Campo obligatorio
    },
    category: {
        type: String,
        default: '' // Valor por defecto si no se proporciona categoría
    },
    stock: {
        type: Number,
        default: 0 // Valor por defecto
    }
});

// Añadir el plugin de paginación
ProductSchema.plugin(mongoosePaginate);

const productModel = model(productCollection, ProductSchema);

module.exports = { productModel };