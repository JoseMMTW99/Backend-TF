const CartDto = require('../dtos/cart.dto');
const { cartService } = require('../service');

class CartController {
    constructor() {
        this.cartService = cartService; // Usa la instancia ya creada del servicio
    }

    getAllCarts = async (req, res) => {
        const { limit, numPage } = req.query;
        try {
            const carts = await this.cartService.getAllCarts({ limit, numPage });
    
            // Extrae datos de paginación
            const { page, hasPrevPage, hasNextPage, prevPage, nextPage } = carts;
    
            // Convierte los carritos a DTOs
            const cartDtos = carts
                .filter(cart => Array.isArray(cart.products) && cart.products.length > 0) // Filtra carritos vacíos
                .map(cart => ({
                    user: cart.user,
                    products: cart.products.map(product => new CartDto(product))
                }));

            res.render('carts', {
                styles: "carts.css",
                carts: cartDtos,
                page,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                limit
            });
        } catch (error) {
            console.error('Error en getAllCarts:', error);
            res.status(500).send({ status: 'error', error: 'Error en getAllCarts' });
        }
    };          
    
    addProductToCart = async (req, res) => {
        const { userId, productId, quantity } = req.body;
        try {
            const cart = await this.cartService.addProductToCart(userId, productId, quantity);
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ status: 'error', error: 'Error adding product to cart' });
        }
    }
}    

module.exports = CartController;