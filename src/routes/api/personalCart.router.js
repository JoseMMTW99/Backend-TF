const express = require('express');
const router = express.Router();
const PersonalCartController = require('../../controllers/personalCart.controller');
const personalCartController = new PersonalCartController();

// Desestructuración de los métodos del controlador del carrito
const { getPersonalCart, deleteCartProduct } = personalCartController;

router.get('/', getPersonalCart);
router.delete('/:cartId/products/:productId', (req, res) => {
    console.log('Solicitud DELETE recibida:', req.params);
    deleteCartProduct(req, res);
});

module.exports = router;