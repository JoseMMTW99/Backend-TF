const ProductDto = require("../dtos/product.dto");
const { productService } = require('../service'); // Ajusta la ruta según la ubicación de tu servicio de productos

class ProductsController {
    constructor() {
        this.productService = productService; // Inyecta el modelo de productos al servicio de productos
    }

    getAllProducts = async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const numPage = parseInt(req.query.numPage) || 1;
            const products = await this.productService.getProducts({ limit, numPage });

            // Extraer datos de paginación si estás utilizando mongoose-paginate-v2
            const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = products;

            res.render('products', {
                styles: "products.css",
                products: docs,
                page,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).send({ status: 'error', error: 'Error fetching products' });
        }
    }

    getAllProductsJson = async (req, res) => {
        try {
            const products = await this.productService.getProductsJson(); // Obtener todos los productos sin paginación
    
            return res.json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            return res.status(500).json({ status: 'error', error: 'Error fetching products' });
        }
    }

    getProductById = async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await this.productService.getProductById(productId);
            if (!product) {
                return res.status(404).send({ status: 'error', error: 'Product not found' });
            }
            res.send({ status: 'success', payload: product });
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).send({ status: 'error', error: 'Error fetching product' });
        }
    }

    createProduct = async (req, res) => {
        const { title, description, price, category, stock } = req.body;
        if (!title || !price) return res.send({ status: 'error', error: 'Missing required fields' });

        const newProduct = {
            title,
            description,
            price,
            category,
            stock
        };

        try {
            const result = await this.productService.createProduct(newProduct);
            res.status(200).send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).send({ status: 'error', error: 'Error creating product' });
        }
    }

    updateProduct = async (req, res) => {
        const { productId } = req.params;
        const { title, description, price, category, stock } = req.body;
        if (!title || !price) return res.send({ status: 'error', error: 'Missing required fields' });

        const updatedFields = {
            title,
            description,
            price,
            category,
            stock
        };

        try {
            const result = await this.productService.updateProduct(productId, updatedFields);
            if (result.nModified === 0) {
                return res.status(404).send({ status: 'error', error: 'Product not found' });
            }
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).send({ status: 'error', error: 'Error updating product' });
        }
    }

    deleteProduct = async (req, res) => {
        const { productId } = req.params;
        try {
            const result = await this.productService.deleteProduct(productId);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).send({ status: 'error', error: 'Error deleting product' });
        }
    }
}

module.exports = ProductsController;