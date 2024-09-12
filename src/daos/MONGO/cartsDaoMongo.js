const { cartsModel } = require("./models/cart.models");

class CartsDaoMongo {
    constructor(){
        this.model = cartsModel;
    }

    // Obtener todos los carritos
    getAll = async ({ limit = 5, numPage = 1 }) => {
        try {
            // Verifica el resultado de la consulta
            const carts = await this.model.find().skip((numPage - 1) * limit).limit(limit);
            console.log('Carts from DAO:', carts);
            return { docs: carts, page: numPage, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null };
        } catch (error) {
            throw new Error('Error al obtener los carritos');
        }
    }

    // Agregar un producto a un carrito
    addProduct = async (cid, pid, quantity) => {
        try {
            // Encuentra el carrito por ID
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Agrega el producto al carrito
            // Verifica si el producto ya está en el carrito
            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
            if (productIndex !== -1) {
                // Si el producto ya está, solo actualiza la cantidad
                cart.products[productIndex].quantity += quantity;
            } else {
                // Si el producto no está, lo agrega
                cart.products.push({ product: pid, quantity });
            }

            // Guarda los cambios en el carrito
            return await this.model.findByIdAndUpdate(cid, cart, { new: true });
        } catch (error) {
            throw new Error('Error al agregar el producto al carrito');
        }
    }

    // Eliminar un producto de un carrito
    removeProduct = async (cid, pid) => {
        try {
            // Encuentra el carrito por ID
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Filtra los productos para eliminar el especificado
            cart.products = cart.products.filter(p => p.product.toString() !== pid);

            // Guarda los cambios en el carrito
            return await this.model.findByIdAndUpdate(cid, cart, { new: true });
        } catch (error) {
            throw new Error('Error al eliminar el producto del carrito');
        }
    }

    // Vaciar el carrito (remover todos los productos)
    deleteCart = async (cid) => {
        try {
            // Encuentra el carrito por ID
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Vacía el carrito
            cart.products = [];

            // Guarda los cambios en el carrito
            return await this.model.findByIdAndUpdate(cid, cart, { new: true });
        } catch (error) {
            throw new Error('Error al vaciar el carrito');
        }
    }
}

module.exports = { CartsDaoMongo };