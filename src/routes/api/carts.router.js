const express = require('express');
const router = express.Router();
const CartController = require('../../controllers/carts.controller');
const auth = require('../../middlewares/auth.middleware');

const cartController = new CartController();

// Desestructuración de los métodos del controlador del carrito
const { getAllCarts, addProductToCart } = cartController;

router.use(auth);

// Definición de rutas del carrito
router.get('/', getAllCarts); // Obtener todos los carritos con paginación
router.post('/addProduct', addProductToCart); // Agregar un producto al carrito de un usuario

module.exports = router;