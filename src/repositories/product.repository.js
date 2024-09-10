const ProductDto = require("../dtos/product.dto");
const { ProductsDaoMongo } = require('../daos/MONGO/productsDaoMongo');

class ProductRepository {
    constructor() {
        this.productDao = new ProductsDaoMongo(); // Inicializa con una instancia de ProductsDaoMongo
    }

    async getProducts({ limit = 5, numPage = 1 }) {
        return await this.productDao.getAll({ limit, numPage });
    }

    async getProductsJson() {
        return await this.productDao.getAllJson();
    }

    async getProductById(pid) {
        return await this.productDao.getById(pid);
    }

    async getProductJsonById(pid) {
        return await this.productDao.getJsonById(pid);
    }

    async createProduct(product) {
        const newProduct = new ProductDto(product);
        return await this.productDao.create(newProduct);
    }

    async updateProduct(pid, productData) {
        return await this.productDao.update(pid, productData);
    }

    async deleteProduct(pid) {
        return await this.productDao.remove(pid);
    }
}

module.exports = ProductRepository;