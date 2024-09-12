const CartDto = require("../dtos/cart.dto");
const { cartService } = require('../service'); // Ajusta la ruta según la ubicación de tu servicio de carrito
const { productService } = require('../service'); // Ajusta la ruta según la ubicación de tu servicio de productos
const { userService } = require('../service'); // Ajusta la ruta según la ubicación de tu servicio de usuarios

class CartController {
    constructor() {
        this.cartService = cartService; // Inyecta el modelo del carrito al servicio del carrito
        this.productService = productService; // Inyecta el modelo de productos al servicio de productos
        this.userService = userService; // Inyecta el servicio de usuarios
    }

    getAllCarts = async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const numPage = parseInt(req.query.numPage) || 1;
            const cartsData = await this.cartService.getAllCarts({ limit, numPage });
    
            // Extraer datos de paginación si estás utilizando mongoose-paginate-v2
            const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = cartsData;
    
            // Aquí obtienes los datos del usuario para cada carrito
            const userPromises = docs.map(async (cart) => {
                const user = await this.userService.getUserById(cart.userId); // Ajusta esto si el campo de usuario es diferente
                return { ...cart.toObject(), user };
            });
    
            const cartsWithUsers = await Promise.all(userPromises);
    
            res.render('carts', {
                styles: "carts.css",
                carts: cartsWithUsers,
                page,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage
            });
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            res.status(500).send({ status: 'error', error: 'Error al obtener los carritos' });
        }
    }    

    addProductToCart = async (req, res) => {
        const { userId, productId, quantity } = req.body;

        try {
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
            }

            const product = await this.productService.getProductById(productId);
            if (!product) {
                return res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
            }

            if (quantity > product.stock) {
                return res.status(400).send({ status: 'error', error: 'Cantidad solicitada excede el stock disponible' });
            }

            const updatedCart = await this.cartService.addProductToCart(userId, productId, quantity);

            res.status(200).send({ status: 'success', payload: updatedCart });
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            res.status(500).send({ status: 'error', error: 'Error al agregar producto al carrito' });
        }
    }

    removeProductFromCart = async (req, res) => {
        const { userId, productId } = req.body;

        try {
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
            }

            const updatedCart = await this.cartService.removeProductFromCart(userId, productId);

            if (!updatedCart) {
                return res.status(404).send({ status: 'error', error: 'Producto o carrito no encontrado' });
            }

            res.status(200).send({ status: 'success', payload: updatedCart });
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            res.status(500).send({ status: 'error', error: 'Error al eliminar producto del carrito' });
        }
    }

    deleteCart = async (req, res) => {
        const { userId } = req.params;

        try {
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
            }

            if (user.cart.length === 0) {
                return res.status(404).send({ status: 'error', error: 'Carrito vacío' });
            }

            const result = await this.cartService.deleteCart(userId);

            if (!result) {
                return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
            }

            res.status(200).send({ status: 'success', message: 'Carrito eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar el carrito:', error);
            res.status(500).send({ status: 'error', error: 'Error al eliminar el carrito' });
        }
    }
}

module.exports = CartController;