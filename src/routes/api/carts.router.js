const express = require('express');
const router = express.Router();
const CartController = require('../../controllers/carts.controller');

const cartController = new CartController();

// Desestructuración de los métodos del controlador del carrito
const { getAllCarts, addProductToCart, removeProductFromCart, deleteCart } = cartController;

// Definición de rutas del carrito
router.get('/', getAllCarts); // Obtener todos los carritos con paginación
router.post('/add', addProductToCart); // Agregar un producto al carrito de un usuario
router.delete('/remove', removeProductFromCart); // Eliminar un producto del carrito de un usuario
router.delete('/:userId', deleteCart); // Eliminar el carrito completo de un usuario

module.exports = router;