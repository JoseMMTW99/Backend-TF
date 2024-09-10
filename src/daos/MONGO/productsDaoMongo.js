const { productModel } = require("./models/products.models");

class ProductsDaoMongo {
    constructor() {
        this.model = productModel;
    }

    // Obtener todos los productos con paginación
    getAll = async ({limit = 5, numPage = 1}) => {
        try {
            return await this.model.paginate({}, { limit, page: numPage, lean: true });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    getAllJson = async () => {
        try {
            const products = await this.model.find({}).lean(); // Asegúrate de que `this.model` esté correctamente definido y sea tu modelo de Mongoose.
    
            return products; // Retorna directamente el array de productos
        } catch (error) {
            console.error('Error al obtener todos los productos:', error);
            throw error;
        }
    }

    // Obtener un producto por filtro dinámico
    async getBy(filter) {
        try {
            return await this.model.findOne(filter);
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            throw error;
        }
    }

    // Obtener un producto por ID
    getById = async (pid) => {
        try {
            return await this.model.findById(pid);
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            throw error;
        }
    }

    // Crear un nuevo producto
    create = async (productData) => {
        try {
            return await this.model.create(productData);
        } catch (error) {
            console.error('Error al crear producto:', error);
            throw error;
        }
    }


    // Actualizar un producto por ID
    update = async (pid, productData) => {
        try {
            return await this.model.findByIdAndUpdate(pid, productData, { new: true });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    // Eliminar un producto por ID
    remove = async (pid) => {
        try {
            return await this.model.findByIdAndDelete(pid);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }
}

module.exports = { ProductsDaoMongo };