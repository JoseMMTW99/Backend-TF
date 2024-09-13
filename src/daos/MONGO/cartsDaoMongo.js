const { userModel } = require("./models/users.models"); // Ajusta la ruta según la ubicación del modelo
const CartDto = require('../../dtos/cart.dto');
const ProductDto = require('../../dtos/product.dto');
const { ProductsDaoMongo } = require('../MONGO/productsDaoMongo'); // Ajusta la ruta según la ubicación del modelo

class CartsDaoMongo {
    constructor() {
        this.model = userModel; // Asigna el modelo de usuarios
        this.productDao = new ProductsDaoMongo(); // Crea una instancia del ProductDaoMongo
    }
    async getAll() {
        try {
            const users = await this.model.find(); // Obtiene todos los usuarios con su carrito
            if (!users || users.length === 0) {
                return []; // Devuelve una lista vacía si no hay usuarios
            }
    
            const carts = users.map(user => {
                // Asegúrate de que user.cart es un objeto y user.cart.products es un array
                const cartProducts = (user.cart && Array.isArray(user.cart.products)) ? user.cart.products : [];
    
                // Crea una lista de productos usando el DTO
                const products = cartProducts.map(item => {
                    if (item && item.title) {
                        return new CartDto(item);
                    } else {
                        console.warn('Producto no definido en el carrito:', item);
                        return null;
                    }
                }).filter(product => product !== null); // Filtra los productos inválidos
    
                return {
                    user: {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        username: user.username
                    },
                    products: products
                };
            });
    
            return carts;
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            throw new Error('Error al obtener los carritos');
        }
    }    
    
    async addProduct(userId, productId, quantity) {
        try {
            const user = await this.model.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
    
            const product = await this.productDao.getById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
    
            const productDto = new ProductDto(product);
    
            if (!user.cart) {
                user.cart = { products: [] };
            }
            
            if (!Array.isArray(user.cart.products)) {
                user.cart.products = [];
            }            
    
            const productIndex = user.cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex !== -1) {
                user.cart.products[productIndex].quantity += quantity;
                user.cart.products[productIndex].price = productDto.price;
            } else {
                user.cart.products.push({ 
                    productId, 
                    quantity, 
                    price: productDto.price, 
                    title: productDto.title,
                    description: productDto.description,
                    category: productDto.category,
                    stock: productDto.stock
                });
            }
    
            console.log('Carrito antes de guardar:', user.cart);
    
            // Actualiza el carrito del usuario
            user.markModified('cart'); // Marca 'cart' como modificado
    
            await user.save();
    
            console.log('Usuario guardado con éxito:', user);
    
            return user.cart;
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw new Error('Error al agregar producto al carrito');
        }
    }    

    // Eliminar un producto del carrito de un usuario
    async deleteProduct(userId, productId) {
        try {
            const user = await this.model.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            user.cart.products = user.cart.products.filter(p => p.productId.toString() !== productId);
            await user.save();
            return user.cart;
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            throw new Error('Error al eliminar producto del carrito');
        }
    }

    // Vaciar todos los productos del carrito pero no eliminar el carrito
    async clearCart(userId) {
        try {
            const user = await this.model.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            user.cart.products = [];
            await user.save();
            return user.cart;
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw new Error('Error al vaciar el carrito');
        }
    }
}

module.exports = { CartsDaoMongo };