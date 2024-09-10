const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productCollection = 'products';

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true // Indexar para mejorar la velocidad de búsqueda
    },
    description: String,
    price: {
        type: Number,
        required: true // Campo obligatorio
    },
    category: String,
    stock: {
        type: Number,
        default: 0 // Valor por defecto
    }
});

ProductSchema.plugin(mongoosePaginate);

const productModel = model(productCollection, ProductSchema);

module.exports = { productModel };