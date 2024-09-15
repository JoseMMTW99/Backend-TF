const CartDto = require("../dtos/cart.dto");
const { CartsDaoMongo } = require('../daos/MONGO/cartsDaoMongo');
const { UsersDaoMongo } = require('../daos/MONGO/usersDaoMongo');
const { ProductsDaoMongo } = require('../daos/MONGO/productsDaoMongo'); // Asegúrate de que la ruta sea correcta

class CartRepository {
    constructor() {
        this.cartDao = new CartsDaoMongo(); // Inicializa con una instancia de CartsDaoMongo
        this.userDao = new UsersDaoMongo(); // Inicializa correctamente UsersDaoMongo
        this.productDao = new ProductsDaoMongo(); // Inicializa correctamente ProductsDaoMongo
    }

    // Obtener todos los carritos
    async getAllCarts() {
        return await this.cartDao.getAll();
    }

    // Agregar un producto al carrito con todos los datos del producto más la cantidad
    async addProductToCart(userId, productId, quantity) {
        try {
            // Obtener el producto completo utilizando el productDao
            const product = await this.cartDao.productDao.getById(productId);
    
            if (!product) {
                throw new Error('Producto no encontrado');
            }
    
            // Agregar el producto al carrito del usuario
            const updatedCart = await this.cartDao.addProduct(userId, productId, quantity);
    
            return updatedCart; // Devuelve el carrito actualizado
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw new Error('Error al agregar producto al carrito');
        }
    }
    
    async removeProductFromCart(userId, productId) {
        try {
            // Llamar al método removeProductFromCart del CartsDaoMongo
            const result = await this.cartDao.removeProductFromCart(userId, productId);
    
            if (result.nModified === 0) {
                throw new Error('No se encontró el producto para eliminar');
            }
    
            return result; // Devuelve el resultado de la eliminación
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            throw new Error('Error al eliminar producto del carrito');
        }
    }

}

module.exports = CartRepository;