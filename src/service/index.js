const { ProductsDaoMongo } = require('../daos/MONGO/productsDaoMongo');
const { UsersDaoMongo } = require('../daos/MONGO/usersDaoMongo');
const ProductRepository = require('../repositories/product.repository');
const UserRepository = require('../repositories/user.repository')
const { initializeDaos, UsersDao, ProductsDao, CartsDao } = require('../daos/factory');

let usersService = new UserRepository(UsersDao);
let productsService  = new ProductRepository(ProductsDao);

// Exportar los servicios después de la inicialización
module.exports = {
    userService: usersService,
    productService: productsService
};