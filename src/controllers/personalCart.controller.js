const CartDto = require('../dtos/cart.dto');
const { cartService } = require('../service');
const mongoose = require('mongoose');

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
            // Verifica y convierte userId a ObjectId si es válido
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.log('Invalid user ID:', userId);
                return res.status(400).send({ status: 'error', error: 'ID de usuario inválido' });
            }
    
            const userIdObjectId = new mongoose.Types.ObjectId(userId);
    
            // Consulta todos los carritos
            const carts = await this.cartService.getAllCarts({ limit, numPage });
    
            // Imprime los datos de los carritos y el userId para depuración
            console.log('Carts data:', carts);
            console.log('User ID:', userId);
    
            // Filtra el carrito del usuario autenticado
            const userCart = Array.isArray(carts)
                ? carts.find(cart => cart.user && cart.user._id && cart.user._id.equals(userIdObjectId))
                : null;
    
            if (!userCart) {
                console.log('No se encontró carrito para el usuario');
                return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
            }
    
            // Calcula el costo total y la cantidad total de productos
            const totalCost = userCart.products.reduce((total, product) => total + (product.price * product.quantity), 0);
            const totalQuantity = userCart.products.reduce((total, product) => total + product.quantity, 0);
    
            // Convierte el carrito a DTO
            const cartDto = {
                user: userCart.user,
                products: userCart.products.map(product => new CartDto(product)),
                totalCost: totalCost.toFixed(2),  // Añadido como string con dos decimales
                totalQuantity
            };
    
            // Extrae datos de paginación (ajusta según sea necesario)
            const { page = 1, hasPrevPage = false, hasNextPage = false, prevPage = null, nextPage = null } = carts;
    
            res.render('personalCart', {
                styles: "carts.css",
                cart: cartDto,
                page,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                limit
            });
        } catch (error) {
            console.error('Error en getPersonalCart:', error);
            res.status(500).send({ status: 'error', error: 'Error en getPersonalCart' });
        }
    };                    

    removeProductFromCart = async (req, res) => {
        const { userId, productId } = req.body;
        try {
            const cart = await this.cartService.removeProductFromCart(userId, productId);
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error removing product from cart:', error);
            res.status(500).json({ status: 'error', error: 'Error removing product from cart' });
        }
    }

    clearCart = async (req, res) => {
        const { userId } = req.params;
        try {
            const cart = await this.cartService.clearCart(userId);
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json({ status: 'error', error: 'Error clearing cart' });
        }
    }
}

module.exports = PersonalCartController;