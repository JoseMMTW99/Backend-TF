const express = require('express');
const router = express.Router();
const PersonalCartController = require('../../controllers/personalCart.controller');
const personalCartController = new PersonalCartController();

// Desestructuración de los métodos del controlador del carrito
const { getPersonalCart, deleteCartProduct, clearCart } = personalCartController;

router.get('/', getPersonalCart);
router.delete('/:cartId/products/:productId', deleteCartProduct);
router.delete('/:userId/clearCart', clearCart);

module.exports = router;