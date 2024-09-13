const CartDto = require("../dtos/cart.dto");
const { CartsDaoMongo } = require('../daos/MONGO/cartsDaoMongo'); // Asegúrate de que la ruta sea correcta

class CartRepository {
    constructor() {
        this.cartDao = new CartsDaoMongo(); // Inicializa con una instancia de CartsDaoMongo
    }

    // Obtener todos los carritos
    async getAllCarts() {
        return await this.cartDao.getAll();
    }

    // Agregar un producto al carrito con todos los datos del producto más la cantidad
    async addProductToCart(userId, productId, quantity) {
    // Obtener el producto completo utilizando el productoDao
    const product = await this.cartDao.productDao.getById(productId);

    if (!product) {
        throw new Error('Producto no encontrado');
    }

    // Crear el DTO del producto incluyendo la cantidad
    const productDto = new CartDto({
        ...product._doc, // Copiar todos los campos del producto
        quantity // Agregar la cantidad al DTO
    });

    // Llamar al método addProduct del DAO para agregar el producto al carrito
    return await this.cartDao.addProduct(userId, productDto.productId, productDto.quantity);
    }

    // Eliminar un producto del carrito
    async removeProductFromCart(userId, productId) {
        return await this.cartDao.deleteProduct(userId, productId);
    }

    // Vaciar el carrito de un usuario
    async deleteCart(userId) {
        return await this.cartDao.clearCart(userId);
    }
}

module.exports = CartRepository;