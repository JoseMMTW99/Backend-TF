const CartDto = require("../dtos/cart.dto");
const { CartsDaoMongo } = require('../daos/MONGO/cartsDaoMongo');

class CartRepository {
    constructor() {
        this.cartDao = new CartsDaoMongo(); // Inicializa con una instancia de CartsDaoMongo
    }

    async getAllCarts({ limit = 5, numPage = 1 }) {
        return await this.cartDao.getAll({ limit, numPage });
    }

    async addProductToCart(cartId, productId, quantity) {
        return await this.cartDao.addProduct(cartId, productId, quantity);
    }

    async removeProductFromCart(cartId, productId) {
        return await this.cartDao.removeProduct(cartId, productId);
    }

    async deleteCart(cartId) {
        return await this.cartDao.remove(cartId);
    }
}

module.exports = CartRepository;
