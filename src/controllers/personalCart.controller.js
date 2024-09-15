const CartDto = require('../dtos/cart.dto');
const { cartService } = require('../service');
const mongoose = require('mongoose');
require('dotenv').config();

class PersonalCartController {
    constructor() {
        this.cartService = cartService;
    }

    getPersonalCart = async (req, res) => {
        const { limit, numPage } = req.query;
        const user = req.session.user;
        const userId = user ? user.id : null;
    
        if (!userId) {
            return res.status(401).send({ status: 'error', error: 'Usuario no autenticado' });
        }
    
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.log('Invalid user ID:', userId);
                return res.status(400).send({ status: 'error', error: 'ID de usuario inválido' });
            }
    
            const userIdObjectId = new mongoose.Types.ObjectId(userId);
            const carts = await this.cartService.getAllCarts({ limit, numPage });
    
            const userCart = Array.isArray(carts)
                ? carts.find(cart => cart.user && cart.user._id && cart.user._id.equals(userIdObjectId))
                : null;
    
            if (!userCart) {
                console.log('No se encontró carrito para el usuario');
                return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
            }
    
            const totalCost = userCart.products.reduce((total, product) => total + (product.price * product.quantity), 0);
            const totalQuantity = userCart.products.reduce((total, product) => total + product.quantity, 0);
    
            const cartDto = {
                user: userCart.user,
                products: userCart.products.map(product => new CartDto(product)), // Asegúrate de que CartDto incluya productId
                totalCost: totalCost.toFixed(2),
                totalQuantity
            };
    
            const { page = 1, hasPrevPage = false, hasNextPage = false, prevPage = null, nextPage = null } = carts;

            const token = req.session.token;
            const tokenStripe = process.env.STRIPE_KEY
    
            res.render('personalCart', {
                styles: "carts.css",
                cart: cartDto,
                page,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                limit,
                token,
                tokenStripe
            });
        } catch (error) {
            console.error('Error en getPersonalCart:', error);
            res.status(500).send({ status: 'error', error: 'Error en getPersonalCart' });
        }
    };
    

   // Método para eliminar un producto del carrito
   deleteCartProduct = async (req, res) => {
    const { cartId, productId } = req.params;

    // Aquí no verificamos autenticación si quieres que cualquier usuario pueda eliminar productos
    // Si solo quieres permitir que los usuarios eliminen productos de su propio carrito, necesitarás una verificación
    
    try {
        // Validar IDs de carrito y producto
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            console.log('ID de carrito inválido:', cartId);
            return res.status(400).send({ status: 'error', error: 'ID de carrito inválido' });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.log('ID de producto inválido:', productId);
            return res.status(400).send({ status: 'error', error: 'ID de producto inválido' });
        }

        const cartIdObjectId = new mongoose.Types.ObjectId(cartId);
        const productIdObjectId = new mongoose.Types.ObjectId(productId);

        // Llama al servicio para eliminar el producto del carrito
        const result = await this.cartService.removeProductFromCart(cartIdObjectId, productIdObjectId);

        // Verificar el resultado de la operación
        if (result.nModified === 0) {
            console.log('No se encontró el producto para eliminar');
            return res.status(404).send({ status: 'error', error: 'Producto no encontrado en el carrito' });
        }

        res.json({ status: 'success' });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).send({ status: 'error', error: 'Error al eliminar el producto del carrito' });
    }
};
clearCart = async (req, res) => {
    const user = req.session.user;
    const userId = user ? user.id : null;

    if (!userId) {
        return res.status(401).send({ status: 'error', error: 'Usuario no autenticado' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log('Invalid user ID:', userId);
            return res.status(400).send({ status: 'error', error: 'ID de usuario inválido' });
        }

        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        const result = await this.cartService.clearCart(userIdObjectId);

        if (result.nModified === 0) {
            console.log('No se encontró el carrito para limpiar');
            return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', message: 'Carrito limpiado con éxito' });
    } catch (error) {
        console.error('Error al limpiar el carrito:', error);
        res.status(500).send({ status: 'error', error: 'Error al limpiar el carrito' });
    }
};

    }

module.exports = PersonalCartController;