const assert = require('assert');
const mongoose = require('mongoose');
const { ProductsDaoMongo } = require("../src/daos/MONGO/productsDaoMongo");


mongoose.connect('mongodb+srv://JoseMMTW99:PublicA%21160499@josemmtw99.7cp9mo3.mongodb.net/Backend_Clases?retryWrites=true&w=majority&appName=JoseMMTW99');


describe('Test ProductsDaoMongo', function () {
    before(function () {
        this.productDao = new ProductsDaoMongo();
    });

    beforeEach(async function() {
        await mongoose.connection.collections['products'].drop();
        this.timeout(5000);
    });

    it('El dao debe obtener los productos en formato arreglo', async function () {
        const result = await this.productDao.getAll({ limit: 5, numPage: 1 });
        assert.strictEqual(Array.isArray(result.docs), true); // `result.docs` contiene el arreglo de productos al usar paginate
    });

    it('El dao debe agregar un producto correctamente a la base de datos', async function () {
        const mockProduct = {
            title: 'Producto de prueba',
            description: 'Descripción del producto de prueba',
            price: 100,
            category: 'Categoria prueba',
            stock: 10
        };

        const result = await this.productDao.create(mockProduct);
        assert.ok(result._id);
    });

    it('El dao puede obtener un producto por título', async function () {
        const mockProduct = {
            title: 'Producto de prueba',
            description: 'Descripción del producto de prueba',
            price: 100,
            category: 'Categoria prueba',
            stock: 10
        };

        await this.productDao.create(mockProduct);
        const product = await this.productDao.getBy({ title: mockProduct.title });

        assert.strictEqual(typeof product, 'object');
        assert.strictEqual(product.title, mockProduct.title);
    });
});