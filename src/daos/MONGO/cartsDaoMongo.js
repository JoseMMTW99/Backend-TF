const { userModel } = require("./models/users.models");
const Cart = require("./models/cart.models");
const User = require('./models/users.models'); // Asegúrate de que la ruta sea correcta
const CartDto = require("../../dtos/cart.dto");
const ProductDto = require("../../dtos/product.dto");
const { ProductsDaoMongo } = require("../MONGO/productsDaoMongo");
const { UsersDaoMongo } = require("../MONGO/usersDaoMongo");

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

      const carts = users.map((user) => {
        // Asegúrate de que user.cart es un objeto y user.cart.products es un array
        const cartProducts =
          user.cart && Array.isArray(user.cart.products)
            ? user.cart.products
            : [];

        // Crea una lista de productos usando el DTO
        const products = cartProducts
          .map((item) => {
            if (item && item.title) {
              return new CartDto(item);
            } else {
              console.warn("Producto no definido en el carrito:", item);
              return null;
            }
          })
          .filter((product) => product !== null); // Filtra los productos inválidos

        return {
          user: {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            username: user.username,
          },
          products: products,
        };
      });

      return carts;
    } catch (error) {
      console.error("Error al obtener los carritos:", error);
      throw new Error("Error al obtener los carritos");
    }
  }

  async addProduct(userId, productId, quantity) {
    try {
      const user = await this.model.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
  
      const product = await this.productDao.getById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
  
      const productDto = new ProductDto(product);
  
      if (!user.cart) {
        user.cart = {
          products: [],
        };
      }
  
      if (!Array.isArray(user.cart.products)) {
        user.cart.products = [];
      }
  
      // Busca si el producto ya está en el carrito
      const productIndex = user.cart.products.findIndex(
        (p) => p.productId.toString() === productId.toString() // Comparar como cadenas
      );
  
      if (productIndex !== -1) {
        // Producto ya existe en el carrito, sumar la cantidad
        user.cart.products[productIndex].quantity += quantity;
      } else {
        // Producto no está en el carrito, agregarlo como nuevo
        user.cart.products.push({
          productId: productDto.productId, // Asegurarse de usar el ID correcto
          quantity: quantity,
          price: productDto.price,
          title: productDto.title,
          description: productDto.description,
          category: productDto.category,
          stock: productDto.stock,
        });
      }
  
      // Marca 'cart' como modificado
      user.markModified("cart");
  
      // Guarda los cambios
      await user.save();
  
      return user.cart;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw new Error("Error al agregar producto al carrito");
    }
  }

  // Eliminar un producto del carrito de un usuario
  async removeProductFromCart(userId, productId) {
    try {
        const result = await userModel.updateOne(
            { _id: userId, 'cart.products.productId': productId },
            { $pull: { 'cart.products': { productId: productId } } }
        );

        if (result.nModified === 0) {
            throw new Error('No se encontró el producto para eliminar');
        }
        return result;
    } catch (error) {
        throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
    }
}

// Limpiar todos los productos del carrito de un usuario
async clearCart(userId) {
  try {
    // Actualiza el carrito del usuario, estableciendo 'products' como un array vacío
    const result = await this.model.updateOne(
      { _id: userId },
      { $set: { 'cart.products': [] } }
    );

    if (result.nModified === 0) {
      throw new Error('No se encontró el carrito para limpiar');
    }
    return result;
  } catch (error) {
    console.error('Error al limpiar el carrito:', error);
    throw new Error('Error al limpiar el carrito');
  }
}
}

module.exports = {
  CartsDaoMongo,
};
