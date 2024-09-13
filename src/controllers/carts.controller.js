const { cartService } = require('../service'); // Ajusta la ruta según la ubicación del servicio de carritos

class CartController {
    constructor() {
        this.cartService = cartService; // Usa la instancia ya creada del servicio
    }

    getAllCarts = async (req, res) => {
        try {
            const { limit, numPage } = req.query;
            const carts = await this.cartService.getAllCarts({ limit, numPage });
            
            // Verifica el formato de los datos
            console.log('Carts data:', carts);
    
            // Asume que `carts` es un objeto con los datos necesarios para la plantilla
            const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = carts;
    
            res.render('carts', {
                styles: "carts.css",
                carts: docs,  // Asegúrate de que docs está en el formato correcto
                page,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                limit,
            });            
        } catch (error) {
            console.error('Error fetching carts:', error);
            res.status(500).send({ status: 'error', error: 'Error fetching carts' });
        }
    }
    
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

module.exports = CartController;