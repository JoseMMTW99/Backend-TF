const { CartsDao, UsersDao, ProductsDao } = require('../daos/factory');
const UserRepository = require('../repositories/user.repository');
const ProductRepository = require('../repositories/product.repository');
const CartRepository = require('../repositories/cart.repository');

// Inicializa los repositorios con los DAOs
const usersService = new UserRepository(UsersDao);
const productsService = new ProductRepository(ProductsDao);
const cartService = new CartRepository(CartsDao);

// Exporta los servicios
module.exports = {
    userService: usersService,
    productService: productsService,
    cartService: cartService
};