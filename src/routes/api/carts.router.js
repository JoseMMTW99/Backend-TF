const express = require('express');
const router = express.Router();
const CartController = require('../../controllers/carts.controller');

const cartController = new CartController();

// Desestructuración de los métodos del controlador del carrito
const { getAllCarts, addProductToCart, removeProductFromCart, clearCart } = cartController;

// Definición de rutas del carrito
router.get('/', getAllCarts); // Obtener todos los carritos con paginación
router.post('/addProduct', addProductToCart); // Agregar un producto al carrito de un usuario
router.delete('/removeProduct', removeProductFromCart); // Eliminar un producto del carrito de un usuario
router.delete('/clear/:userId', clearCart); // Vaciar el carrito completo de un usuario

module.exports = router;