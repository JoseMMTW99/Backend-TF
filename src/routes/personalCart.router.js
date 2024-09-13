const express = require('express');
const router = express.Router();
const PersonalCartController = require('../../src/controllers/personalCart.controller');

const personalCartController = new PersonalCartController();

// Desestructuración de los métodos del controlador del carrito
const { getPersonalCart, removeProductFromCart, clearCart } = personalCartController;

// Definición de rutas del carrito
router.get('/', getPersonalCart); // Obtener todos los carritos con paginación
router.delete('/removeProduct', removeProductFromCart); // Eliminar un producto del carrito de un usuario
router.delete('/clear/:userId', clearCart); // Vaciar el carrito completo de un usuario

module.exports = router;