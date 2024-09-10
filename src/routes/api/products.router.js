const express = require('express');
const router = express.Router();
const ProductsController = require('../../controllers/products.controller');

const productsController = new ProductsController();

const { getAllProducts, getAllProductsJson, getProductById, createProduct, updateProduct, deleteProduct } = productsController;

router.get('/', getAllProducts);
router.get('/json', getAllProductsJson);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;